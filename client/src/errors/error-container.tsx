import { observer } from "mobx-react";
import errorStore from "./error-store";

function ErrorContainer() {
    const errors = errorStore.errors;

    return <div className="flex flex-col gap-2">
        {errors.map((error: string, i: number) => {
            return <div className="text-xs text-red-700" key={i}>{error}</div>
        })}
    </div>
}

export default observer(ErrorContainer);