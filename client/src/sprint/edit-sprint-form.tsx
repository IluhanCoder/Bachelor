import { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from "react";
import FormComponent from "../forms/form-component";
import Sprint, { SprintPutRequest, SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import DatePicker from "../analytics/date-picker";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import { inputStyle } from "../styles/form-styles";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    sprintId: string,
    callBack?: () => void
}

function EditSprintForm({sprintId, callBack}: LocalParams) {
    const [sprintData, setSprintData] = useState<Sprint>();
    const [formData, setFormData] = useState<{
        name: string,
        goal: string,
        startDate: Date,
        endDate: Date
    } | undefined>(undefined)

    const getSprintData = async () => {
        if(sprintId) {
            const result = await sprintService.getSprintById(sprintId); 
            console.log(result);
            setSprintData({...result.sprint});
        }
    }

    useEffect(() => {
        getSprintData();
    }, [])

    useEffect(() => {
        const updatedData: SprintPutRequest = {
            name: sprintData?.name ?? "",
            goal: sprintData?.goal ?? "",
            startDate: sprintData?.startDate ?? new Date(),
            endDate: sprintData?.endDate ?? new Date()
        };
        setFormData({...updatedData});
    }, [sprintData])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(formData)
            setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            });
    };   

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if(formData) {
            await sprintService.editSprint(sprintId, formData);
            formStore.dropForm();
            if(callBack) callBack();
        }
    }

    const handleStart = (date: Date) => {
        if(formData) {
            if(date >= formData.endDate) return;
            const newData: SprintPutRequest = {
                name: formData?.name,
                goal: formData?.goal,
                startDate: date,
                endDate: formData.endDate
            };
            setFormData({...newData});
        }
    }

    const handleEnd = (date: Date) => {
        if(formData) {
            if(date <= formData.startDate) return;
            const newData: SprintPutRequest = {
                name: formData?.name,
                goal: formData?.goal,
                startDate: formData.startDate,
                endDate: date
            };
            setFormData({...newData});
        }
    }

    return <FormComponent formLabel="спрінт">
        {formData?.name && <form className="flex flex-col gap-2" onSubmit={(event: FormEvent) => {handleSubmit(event)}}>
            <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600 text-xs">назва:</label>
                <input className={inputStyle + " w-96"} type="text" name="name" defaultValue={formData.name} onChange={handleChange}/>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600 text-xs">мета:</label>
                <input className={inputStyle} type="text" name="goal" defaultValue={formData.goal} onChange={handleChange}/>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex justify-center">Терміни:</div>
                <div className="flex justify-center">
                    <DatePicker className="flex flex-col gap-2" handleStart={handleStart} handleEnd={handleEnd} startDate={formData.startDate} endDate={formData.endDate}/>
                </div>
            </div>
            <div className="flex justify-center mt-2">
                <button type="submit" className={submitButtonStyle}>внести зміни</button>
            </div>
        </form> || <div className="w-96"><LoadingScreen/></div>}
    </FormComponent>
}

export default EditSprintForm;