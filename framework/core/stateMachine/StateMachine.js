"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTransition = void 0;
function BuildTransition(from, to, onTransition) {
    return { from, to, onTransition };
}
exports.BuildTransition = BuildTransition;
var Code;
(function (Code) {
    Code[Code["NoFoundTransition"] = 0] = "NoFoundTransition";
    Code[Code["Transiting"] = 1] = "Transiting";
    Code[Code["ChangeStateFailure"] = 2] = "ChangeStateFailure";
})(Code || (Code = {}));
const reason = {
    [Code.NoFoundTransition]: `You can not {0} now. Current state is {1}`,
    [Code.Transiting]: `This is transiting now. You cannot transition more times at one time.`,
    [Code.ChangeStateFailure]: `From {0} to {1} state failure`,
};
/**
 * @description 状态机
 */
class StateMachine {
    constructor(option) {
        this._transitions = null;
        this._originTransitions = null;
        this._isTransiting = false;
        const { init, transitions } = option;
        this._curState = init;
        this.setupTransitions(transitions);
    }
    setupTransitions(transitions) {
        this._originTransitions = transitions;
        this._transitions = {};
        Object.keys(transitions).forEach(k => {
            const key = k;
            const value = transitions[key];
            let self = this;
            this._transitions[key] = function () {
                if (!self.exist(key)) {
                    self.postError(Code.NoFoundTransition, String.format(reason[Code.NoFoundTransition], key, self._curState));
                    return;
                }
                if (self._isTransiting) {
                    self.postError(Code.Transiting, reason[Code.Transiting]);
                    return;
                }
                const curState = self._curState;
                const dir = self._findDir(curState, value);
                if (dir == null) {
                    self.postError(Code.NoFoundTransition, String.format(reason[Code.NoFoundTransition], key, self._curState));
                    return;
                }
                const { to, onTransition } = dir;
                const toState = ((typeof to === 'function') ? (Reflect.apply(to, this, arguments)) : to);
                self._isTransiting = true;
                self.onBefore && self.onBefore(curState, toState);
                let result = true;
                if (onTransition) {
                    result = onTransition(curState, toState);
                }
                if (result) {
                    self._curState = toState;
                }
                else {
                    self.postError(Code.ChangeStateFailure, String.format(reason[Code.ChangeStateFailure], curState, toState));
                    self.onAfter && self.onAfter(curState, toState);
                    self._isTransiting = false;
                    return;
                }
                self.onAfter && self.onAfter(curState, toState);
                self._isTransiting = false;
            };
        });
    }
    postError(code, reason) {
        this.onError && this.onError(code, reason);
    }
    get transition() {
        return this._transitions;
    }
    /**@description 获取当前状态机状态 */
    get state() {
        return this._curState;
    }
    /**@description 判断当前是否是该状态 */
    is(state) {
        return this._curState == state;
    }
    /**
     * @description 判断是否存在transition
     * @param t transition名
     */
    exist(t) {
        const value = this._originTransitions[t];
        if (!value) {
            return false;
        }
        const dir = this._findDir(this._curState, value);
        return dir != null;
    }
    _findDir(from, dirs) {
        if (Array.isArray(dirs)) {
            return this._findDirOfArray(from, dirs);
        }
        if (this._isIncludeState(dirs.from, from)) {
            return dirs;
        }
        return null;
    }
    _findDirOfArray(from, dirs) {
        for (const index in dirs) {
            const dir = dirs[index];
            if (this._isIncludeState(dir.from, from)) {
                return dir;
            }
        }
        return null;
    }
    _isIncludeState(state, targetState) {
        if (state === '*') {
            return true;
        }
        if (targetState === state) {
            return true;
        }
        if (Array.isArray(state) && (state.indexOf(targetState) != -1)) {
            return true;
        }
        return false;
    }
}
StateMachine.Code = Code;
exports.default = StateMachine;
