import { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from "react";
import FormComponent from "../forms/form-component";
import Sprint, { SprintPutRequest, SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import DatePicker from "../analytics/date-picker";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";

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
        {formData?.name && <form onSubmit={(event: FormEvent) => {handleSubmit(event)}}>
            <div>
                <label>назва:</label>
                <input type="text" name="name" defaultValue={formData.name} onChange={handleChange}/>
            </div>
            <div>
                <label>мета:</label>
                <input type="text" name="goal" defaultValue={formData.goal} onChange={handleChange}/>
            </div>
            <div>
                <DatePicker handleStart={handleStart} handleEnd={handleEnd} startDate={formData.startDate} endDate={formData.endDate}/>
            </div>
            <div>
                <button type="submit" className={submitButtonStyle}>внести зміни</button>
            </div>
        </form>}
    </FormComponent>
}

export default EditSprintForm;