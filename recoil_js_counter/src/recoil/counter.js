import { atom, useRecoilState } from "recoil";

export const counterState = atom({
    key : 'counterState',
    default : 0
});

export const useCounter = () => {
    const [counter , setCounter] = useRecoilState(counterState);

    return [counter,  setCounter];
}

