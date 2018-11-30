import ExecutionEnvironment  from "exenv";

const ExE = ExecutionEnvironment;
const safeElement = ExE.canUseDOM ? window.HTMLElement : {};

export const safeUsingDom = ExE.canUseDOM;
export default safeElement;




