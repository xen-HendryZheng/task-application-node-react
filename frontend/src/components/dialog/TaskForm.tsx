import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography, 
  Input,
  Textarea,
  Radio
} from "@material-tailwind/react";

interface TaskFormProps {
    openDialog: boolean;
    handler: () => void;
}

export function TaskFormDialog({openDialog, handler}: TaskFormProps ) {
  
  return (
    <>
      <Dialog placeholder={''} open={openDialog} handler={handler}>
        <DialogHeader placeholder={''}>Add New Task.</DialogHeader>
        <DialogBody placeholder={''}>
            <hr/>
            <form className="mt-5 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                <Typography placeholder={''} variant="h6" color="blue-gray" className="-mb-3">
                    Task Name
                </Typography>
                <Input
                    size="lg"
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
                    type="datetime-local"
                    size="lg"
                    placeholder="Enter your task description"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    crossOrigin={''}
                />
                </div>
                
                
            </form>
        </DialogBody>
        <DialogFooter placeholder={''}>
          <Button
            placeholder={''}
            variant="text"
            color="red"
            onClick={handler}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button placeholder={''} variant="gradient" color="green" onClick={handler}>
            <span>Add Task</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
export default TaskFormDialog;