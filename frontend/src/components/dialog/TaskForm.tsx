import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Input,
    Textarea,
    Radio,
    Alert
} from "@material-tailwind/react";
import TaskService from "../../services/TaskService";
import { AlertContext } from "../alert/Alert";
import moment from 'moment'

interface TaskFormProps {
    openDialog: boolean;
    closeHandler: () => void;
    isNewTask: boolean;
    taskObject: {
        taskId: number;
        taskName: string;
        description: string;
        dueDate: string
    }
    taskCreatedHandler: (task: any) => void;
    taskUpdateHandler: () => void;
}

export function TaskFormDialog({ openDialog, closeHandler, taskCreatedHandler, taskUpdateHandler, isNewTask, taskObject }: TaskFormProps) {
    const { showAlert } = useContext(AlertContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [taskForm, setTaskForm] = useState({
        taskName: '',
        description: '',
        dueDate: ''
    })
    useEffect(()=>{
        if (openDialog && !isNewTask && taskObject) {
            setTaskForm({
                taskName: taskObject.taskName,
                description: taskObject.description,
                dueDate: moment(taskObject.dueDate).format('YYYY-MM-DD')
            })
        }
    },[openDialog, isNewTask, taskObject])
    
    async function handleTaskSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        const { taskName, description, dueDate } = taskForm;
        const dueDateIso = new Date(dueDate).toISOString();

        if (!isNewTask && taskObject) {
            const { taskId } = taskObject;
            TaskService.patchTask(taskId, taskName, description, dueDateIso).then(response => {
                if (response.status === 200) {
                    taskUpdateHandler();
                    showAlert(`Task ${response.data.task_name} Updated Successfully`, 'success');
                    closeHandler();
                } else {
                    setErrorMessage(`Task Update failed ! ${response.data.message}`)
                }
            }).catch(error => {
                console.log(error);
                // setMessage(`Login failed ! ${error.response.data.message}`)
                setErrorMessage(`Task Update failed ! ${error.response.data.message}`)
            })
        } else {
            TaskService.createTask(taskName, description, dueDateIso).then(response => {
                if (response.status === 201) {
                    taskCreatedHandler(response.data);
                    showAlert(`Task ${response.data.task_name} Created Successfully`, 'success');
                    closeHandler();
                } else {
                    setErrorMessage(`Task Creation failed ! ${response.data.message}`)
                }
            }).catch(error => {
                console.log(error);
                // setMessage(`Login failed ! ${error.response.data.message}`)
                setErrorMessage(`Task Creation failed ! ${error.response.data.message}`)
            })
        }

        
    }
    return (
        <>
            <Dialog placeholder={''} open={openDialog} handler={closeHandler}>
                <form onSubmit={handleTaskSubmit} className="mt-5 mb-2 max-w-screen-lg">
                    <DialogHeader placeholder={''}>Add New Task.</DialogHeader>
                    {errorMessage && <Alert className="m-5 w-100" onClose={()=>{setErrorMessage('')}} color="red">{errorMessage}</Alert>}
                    <DialogBody placeholder={''}>
                        <hr />

                        <div className="mb-1 flex flex-col gap-6">
                            <Typography placeholder={''} variant="h6" color="blue-gray" className="-mb-3">
                                Task Name
                            </Typography>
                            <Input
                                size="lg"
                                required={true}
                                value={taskForm.taskName}
                                onChange={(e) => {
                                    setTaskForm({
                                        ...taskForm,
                                        taskName: e.target.value
                                    })
                                }}
                                name="task_name"
                                placeholder="Enter your task name"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                crossOrigin={''}
                            />
                            <Typography placeholder={''} variant="h6" color="blue-gray" className="-mb-3">
                                Task Description
                            </Typography>
                            <Textarea
                                size="lg"
                                name="description"
                                required={true}
                                value={taskForm.description}
                                onChange={(e) => {
                                    setTaskForm({
                                        ...taskForm,
                                        description: e.target.value
                                    })
                                }}
                                placeholder="Enter your task description"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                            <Typography placeholder={''} variant="h6" color="blue-gray" className="-mb-3">
                                Due Date
                            </Typography>
                            <Input
                                required={true}
                                name="due_date"
                                type="date"
                                size="lg"
                                value={taskForm.dueDate}
                                onChange={(e) => {
                                    setTaskForm({
                                        ...taskForm,
                                        dueDate: e.target.value
                                    })
                                }}
                                placeholder="Enter your task description"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                crossOrigin={''}
                            />
                        </div>

                    </DialogBody>
                    <DialogFooter placeholder={''}>
                        <Button

                            placeholder={''}
                            variant="text"
                            color="red"
                            onClick={closeHandler}
                            className="mr-1"
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button type="submit" placeholder={''} variant="gradient" color="green">
                            <span>{isNewTask ? 'Add Task' : 'Update Task'}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </>
    );
}
export default TaskFormDialog;