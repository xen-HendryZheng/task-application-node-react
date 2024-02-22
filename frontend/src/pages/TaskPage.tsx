/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
    CardFooter,
    Switch
} from "@material-tailwind/react";

import React, { useEffect, useState } from "react";
import TaskFormDialog from "../components/dialog/TaskForm";
import TaskService from "../services/TaskService";
import moment from "moment";
import * as _ from 'lodash';

//Generate a simple task page with a form to add a task and a list of tasks in react
const TaskPage = () => {
    const [showClickHouse, setShowClickHouse] = useState(false);
    const [urlSearchParams] = useState(new URLSearchParams());
    const [useClickHouse, setUseClickHouse] = useState(false);
    const [totalRecord, setTotalRecord] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortByCreated, setSortByCreated] = useState('');
    const [sortByDue, setSortByDue] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [tasks, setTasks] = useState<any[]>([]); 
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

    function handleSort(field: string) {
        let order = '';
        switch (field) {
            case 'Created':
                order = sortByCreated === 'ASC' || sortByCreated === '' ? 'DESC' : 'ASC';
                setSortByCreated(order)
                setSortByDue('')
                urlSearchParams.delete('sortByDue')
                break;
            case 'Due':
                order = sortByDue === 'ASC' || sortByDue === '' ? 'DESC' : 'ASC';
                setSortByDue(order)
                setSortByCreated('')
                urlSearchParams.delete('sortByCreated')
                break;
            default:
                break;
        }
        // Set sorting criteria
        urlSearchParams.set(`sortBy${field}`, order)
        const urlParamsString = urlSearchParams.toString();
        console.log(urlParamsString);
        getTasks();
    }

    function handleSearch() {
        if (searchKeyword === '') {
            urlSearchParams.delete('search')
        } else {
            urlSearchParams.set('search', encodeURIComponent(searchKeyword))
        }
        getTasks();
    }

    async function getTasks() {
        const urlParamsString = urlSearchParams.toString();
        const response = await TaskService.getTask(urlParamsString, useClickHouse.toString());
        setTasks(response.data.tasks);
        setTotalRecord(response.data.total_record);
        setTotalPage(response.data.total_page);
    }
    useEffect(() => {
        getTasks();
    }, [])

    return (
        <>
            <TaskFormDialog openDialog={openDialog} taskCreatedHandler={(task: any) => {setTasks([task,...tasks])}} closeHandler={() => { setOpenDialog(!openDialog); }} isNewTask={isNewTask} taskUpdateHandler={()=>{getTasks()}} taskObject={taskEditObject} />
            <div className="mt-12 mb-8 flex flex-col gap-12">
                <Card placeholder={''}>
                    <CardHeader placeholder={''} className="mb-8 p-6">
                        <Typography placeholder={''} variant="h5" color="black">
                            <span onClick={()=>{setShowClickHouse(!showClickHouse)}}>Task Listing</span> <Button
                                size="sm"
                                variant="gradient"
                                className=""
                                onClick={() => {
                                    setOpenDialog(true)
                                    setIsNewTask(true)
                                }}
                                placeholder={''}>
                                Add New
                            </Button>
                        </Typography>
                        <div className="mt-5 relative flex w-full max-w-[24rem]">
                            <Input
                                type="text"
                                label="Search (task name)"
                                value={searchKeyword}
                                onChange={onChange}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                                className="pr-20"
                                containerProps={{
                                    className: "min-w-0",
                                }} crossOrigin={undefined} />
                            <Button
                                onClick={handleSearch}
                                size="sm"
                                color={searchKeyword ? "gray" : "blue-gray"}
                                // disabled={!searchKeyword}
                                className="!absolute right-1 top-1 rounded"
                                placeholder={''}>
                                Search
                            </Button>
                        </div>
                        <div className={ !showClickHouse ? 'hidden mt-5 relative flex w-full max-w-[24rem]' : 'mt-5 relative flex w-full max-w-[24rem]'}>
                            <Switch defaultChecked={false} onChange={() => { setUseClickHouse(!useClickHouse) }} label="Use Clickhouse" className="float-right" crossOrigin={''} />
                        </div>
                    </CardHeader>
                    <CardBody placeholder={''} className="overflow-x-scroll px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography
                                            placeholder={''}
                                            variant="small"
                                            className="flex text-[11px] font-bold uppercase text-blue-gray-400">ID</Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography
                                            placeholder={''}
                                            variant="small"
                                            className="flex text-[11px] font-bold uppercase text-blue-gray-400"  >
                                            TASK
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography
                                            placeholder={''}
                                            variant="small"
                                            className="flex text-[11px] font-bold uppercase text-blue-gray-400"  >
                                            DESCRIPTION
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography
                                            placeholder={''}
                                            variant="small"
                                            className="flex text-[11px] font-bold uppercase text-blue-gray-400"  >
                                            DUE DATE
                                            <button onClick={() => handleSort('Due')}>
                                                {
                                                    sortByDue === '' &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                                    </svg>

                                                }
                                                {
                                                    sortByDue === 'DESC' &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                                    </svg>
                                                }
                                                {
                                                    sortByDue === 'ASC' &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                                    </svg>
                                                }
                                            </button>

                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography
                                            placeholder={''}
                                            variant="small"
                                            className="flex text-[11px] font-bold uppercase text-blue-gray-400"  >
                                            CREATED
                                            <button onClick={() => handleSort('Created')}>
                                                {
                                                    sortByCreated === '' &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                                    </svg>

                                                }
                                                {
                                                    sortByCreated === 'DESC' &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                                    </svg>
                                                }
                                                {
                                                    sortByCreated === 'ASC' &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                                    </svg>
                                                }
                                            </button>
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography
                                            placeholder={''}
                                            variant="small"
                                            className="flex text-[11px] font-bold uppercase text-blue-gray-400"  >
                                            STATUS
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography
                                            placeholder={''}
                                            variant="small"
                                            className="flex text-[11px] font-bold uppercase text-blue-gray-400"  >
                                            ACTION
                                        </Typography>
                                    </th>
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
                                                        onClick={() => editTask(task_id, task_name, task_description, task_due_date)}
                                                        placeholder={''}
                                                        as="a"
                                                        href="#"
                                                        className="text-xs font-semibold text-blue-600"
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
                        <div className="float-right" color="gray">
                            <div className="flex justify-between items-center mt-8">
                                <Button
                                    size="sm"
                                    color="blue-gray"
                                    disabled={currentPage === 1}
                                    onClick={() => {
                                        setCurrentPage(currentPage - 1);
                                        urlSearchParams.set('page', (currentPage - 1).toString());
                                        getTasks();
                                    }}
                                    placeholder={''}>
                                    Previous
                                </Button>
                                {
                                    totalPage > 0 && Array.from(Array(Math.min(totalPage, 10)).keys()).map((page, index) => {
                                        // Limit only up to 10 pages and show last page button
                                        if (index === 9 && totalPage > 10) {
                                            return (
                                                <Button
                                                    key={index}
                                                    size="sm"
                                                    color={currentPage === totalPage ? "red" : "blue-gray"} // Set different color for current page
                                                    variant="text"
                                                    onClick={() => {
                                                        setCurrentPage(totalPage);
                                                        urlSearchParams.set('page', totalPage.toString());
                                                        getTasks();
                                                    }}
                                                    placeholder={''}>
                                                    Last
                                                </Button>
                                            );
                                        } else {
                                            return (
                                                <Button
                                                    key={index}
                                                    size="sm"
                                                    color={currentPage === page + 1 ? "red" : "blue-gray"} // Set different color for current page
                                                    variant="text"
                                                    onClick={() => {
                                                        setCurrentPage(page + 1);
                                                        urlSearchParams.set('page', (page + 1).toString());
                                                        getTasks();
                                                    }}
                                                    placeholder={''}>
                                                    {page + 1}
                                                </Button>
                                            );
                                        }
                                    })
                                }

                                <Button
                                    size="sm"
                                    color="blue-gray"
                                    disabled={currentPage === totalPage}
                                    onClick={() => {
                                        setCurrentPage(currentPage + 1);
                                        urlSearchParams.set('page', (currentPage + 1).toString());
                                        getTasks();
                                    }}
                                    placeholder={''}>
                                    Next
                                </Button>
                            </div>
                            <div className="float-right mt-3">
                                <Typography
                                    placeholder={''}
                                    variant="small"
                                    className="text-xs font-semibold uppercase tracking-wide"
                                    color="blue-gray">
                                    <b>Total Record</b> : {totalRecord.toLocaleString()}
                                </Typography>
                            </div>
                        </div>


                    </CardFooter>
                </Card>
            </div>
        </>

    );
}
export default TaskPage;