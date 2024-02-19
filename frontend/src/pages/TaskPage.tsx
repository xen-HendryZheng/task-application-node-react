import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Tooltip,
    Progress,
    Button,
    Input,
    CardFooter
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import authorsTableData from "../data/authors-table-data";
import React from "react";
import TaskFormDialog from "../components/dialog/TaskForm";

//Generate a simple task page with a form to add a task and a list of tasks in react
const TaskPage = () => {
    const [searchKeyword, setSearchKeyword] = React.useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value);
    const [openDialog, setOpenDialog] = React.useState(false);

    return (
        <>
            <TaskFormDialog openDialog={openDialog} handler={() => { setOpenDialog(!openDialog) }} />
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
                                    {["id", "created", "task", "description", "due date", "status"].map((el) => (
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
                                {authorsTableData.map(
                                    ({ img, name, email, job, online, date }, key) => {
                                        const className = `py-3 px-5 ${key === authorsTableData.length - 1
                                            ? ""
                                            : "border-b border-blue-gray-50"
                                            }`;

                                        return (
                                            <tr key={name}>
                                                <td className={className}>
                                                    <div className="flex items-center gap-4">
                                                        <Avatar src={img} alt={name} size="sm" variant="rounded" placeholder={''} />
                                                        <div>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-semibold" placeholder={''} >
                                                                {name}
                                                            </Typography>
                                                            <Typography placeholder={''} className="text-xs font-normal text-blue-gray-500">
                                                                {email}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Typography placeholder={''} className="text-xs font-semibold text-blue-gray-600">
                                                        {job[0]}
                                                    </Typography>
                                                    <Typography placeholder={''} className="text-xs font-normal text-blue-gray-500">
                                                        {job[1]}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Chip
                                                        variant="gradient"
                                                        color={online ? "green" : "blue-gray"}
                                                        value={online ? "online" : "offline"}
                                                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                    />
                                                </td>
                                                <td className={className}>
                                                    <Typography placeholder={''} className="text-xs font-semibold text-blue-gray-600">
                                                        {date}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography
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