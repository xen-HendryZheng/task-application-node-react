import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
    CardFooter
} from "@material-tailwind/react";

import React, { useContext, useEffect, useState } from "react";
import TaskFormDialog from "../components/dialog/TaskForm";
import TaskService from "../services/TaskService";
import { AlertContext } from "../components/alert/Alert";
import moment from "moment";
import * as _ from 'lodash';

//Generate a simple task page with a form to add a task and a list of tasks in react
const TaskPage = () => {
    const { showAlert } = useContext(AlertContext);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [tasks, setTasks] = useState([])
    const [isNewTask, setIsNewTask] = useState(false);
    const [taskEditObject, setTaskEditObject] = useState({
        taskId: 0,
        taskName: '',
        description: '',
        dueDate: ''
    })
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value);
    function formatDate(date: string) {
        return moment(date).format('llll')
    }
    function editTask(taskId: number, taskName: string, description: string, dueDate: string) {
        setIsNewTask(false)
        setTaskEditObject({
            taskId,
            taskName,
            description,
            dueDate
        })
        setOpenDialog(true)
    }

    async function getTasks() {
        const response = await TaskService.getTask();
        setTasks(response.data);
    }
    useEffect(() => {
        getTasks();
    }, [])

    return (
        <>
            <TaskFormDialog openDialog={openDialog} closeHandler={() => { setOpenDialog(!openDialog); }} isNewTask={isNewTask} taskObject={taskEditObject} />
            <div className="mt-12 mb-8 flex flex-col gap-12">
                <Card placeholder={''}>
                    <CardHeader placeholder={''} className="mb-8 p-6">
                        <Typography placeholder={''} variant="h5" color="black">
                            Task Listing <Button
                                size="sm"
                                variant="gradient"
                                className=""
                                onClick={() => {
                                    setOpenDialog(true)
                                }}
                                placeholder={''}>
                                Add New
                            </Button>
                        </Typography>
                        <div className="mt-5 relative flex w-full max-w-[24rem]">
                            <Input
                                type="text"
                                label="Search (task name, description)"
                                value={searchKeyword}
                                onChange={onChange}
                                className="pr-20"
                                containerProps={{
                                    className: "min-w-0",
                                }} crossOrigin={undefined} />
                            <Button
                                size="sm"
                                color={searchKeyword ? "gray" : "blue-gray"}
                                disabled={!searchKeyword}
                                className="!absolute right-1 top-1 rounded"
                                placeholder={''}>
                                Search
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody placeholder={''} className="overflow-x-scroll px-0 pt-0 pb-2">



                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {["id", "task", "description", "due date", "created", "status", "action"].map((el) => (
                                        <th
                                            key={el}
                                            className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                        >
                                            <Typography
                                                placeholder={''}
                                                variant="small"
                                                className="text-[11px] font-bold uppercase text-blue-gray-400"
                                            >
                                                {el}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(
                                    ({ task_id, task_name, task_created, task_description, task_due_date, task_status }, key) => {
                                        const className = `py-3 px-5 ${key === tasks.length - 1
                                            ? ""
                                            : "border-b border-blue-gray-50"
                                            }`;

                                        return (
                                            <tr key={task_id}>
                                                <td className={className}>
                                                    <Typography placeholder={''} className="text-xs font-semibold text-blue-gray-600">
                                                        {task_id}
                                                    </Typography>
                                                </td>

                                                <td className={className}>
                                                    <Typography placeholder={''} className="text-xs font-semibold text-blue-gray-600">
                                                        {task_name}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography placeholder={''} className="text-xs font-semibold text-blue-gray-600">
                                                        {task_description}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography placeholder={''} className="text-xs font-semibold text-blue-gray-600">
                                                        {formatDate(task_due_date)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography placeholder={''} className="text-xs font-semibold text-blue-gray-600">
                                                        {formatDate(task_created)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography placeholder={''} className="text-xs font-semibold text-blue-gray-600">
                                                        {_.startCase(task_status)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography
                                                        onClick={()=>editTask(task_id, task_name, task_description, task_due_date)}
                                                        placeholder={''}
                                                        as="a"
                                                        href="#"
                                                        className="text-xs font-semibold text-blue-gray-600"
                                                    >
                                                        Edit
                                                    </Typography>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter
                        className="ml-6"
                        placeholder={''} >
                        <Typography className="float-right" placeholder={''} color="gray">
                            Total Record 2560
                        </Typography>
                    </CardFooter>
                </Card>
            </div>
        </>

    );
}
export default TaskPage;