import { ChangeEvent, useEffect, useState } from "react";
import { Participant, ParticipantResponse, Rights } from "./project-types";
import projectService from "./project-service";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { lightButtonStyle } from "../styles/button-syles";

function EditRightsPage () {
    const {projectId} = useParams();

    const [rights, setRights] = useState<ParticipantResponse[]>([]);
    const [formData, setFormData] = useState<Rights[]>([]);

    const getRights = async () => {
        if(projectId) {
            const result = await projectService.getRights(projectId);
            const collectedData: Rights[] = result.rights.map((participant: ParticipantResponse) => participant.rights);
            setRights(result.rights);
            setFormData(collectedData);
        }   
    };

    const checkValue = async (index: number, fieldName: string) => {
        const newData = formData[index];
        newData[fieldName as keyof Rights] = !newData[fieldName as keyof Rights];

        const newFormData = formData;
        newFormData[index] = newData;

        const newRights: Participant[] = rights.map((participant: ParticipantResponse, index: number) => { return {participant: participant.participant._id, rights: newFormData[index]}});
        if(projectId) {
            await projectService.setRights(projectId, newRights); 
            getRights();
        }
    }

    useEffect(() => {getRights()},[]);

    return <div className="p-2 flex flex-col">
        <div className="flex">
            <Link to={`/project/${projectId}`} className={lightButtonStyle}>Назад до проекту</Link>
        </div>
        <div className="py-4">
        <table className="w-full">
            <tr className="text-xs">
                <th>користувач</th>
                <th>додавати учасників</th>
                <th>встановлювати статус задач</th>
                <th>створювати задачі</th>
                <th>видаляти задачі</th>
                <th>редагувати задачі</th>
                <th>видаляти учасників</th>
                <th>змінювати інформацію про проект</th>
            </tr>
            {rights.map((right: ParticipantResponse, index: number) => 
                <tr className="border">
                    <td>{right.participant.name}</td>
                    <td className="text-center"><input type="checkbox" checked={formData[index].addParticipants} onChange={() => checkValue(index, "addParticipants")}/></td>
                    <td className="text-center"><input type="checkbox" checked={formData[index].check} onChange={() => checkValue(index, "check")}/></td>
                    <td className="text-center"><input type="checkbox" checked={formData[index].create} onChange={() => checkValue(index, "create")}/></td>
                    <td className="text-center"><input type="checkbox" checked={formData[index].delete} onChange={() => checkValue(index, "delete")}/></td>
                    <td className="text-center"><input type="checkbox" checked={formData[index].edit} onChange={() => checkValue(index, "edit")}/></td>
                    <td className="text-center"><input type="checkbox" checked={formData[index].editParticipants} onChange={() => checkValue(index, "editParticipants")}/></td>
                    <td className="text-center"><input type="checkbox" checked={formData[index].editProjectData} onChange={() => checkValue(index, "editProjectData")}/></td>
                </tr>
            )}
        </table>
    </div>
    </div>
}

export default EditRightsPage;