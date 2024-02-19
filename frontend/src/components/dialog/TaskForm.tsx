import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography, 
  Input
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
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                <Typography placeholder={''} variant="h6" color="blue-gray" className="-mb-3">
                    Your Name
                </Typography>
                <Input
                    size="lg"
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    crossOrigin={''}
                />
                <Typography placeholder={''} variant="h6" color="blue-gray" className="-mb-3">
                    Your Email
                </Typography>
                <Input
                    size="lg"
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    crossOrigin={''}
                />
                <Typography placeholder={''} variant="h6" color="blue-gray" className="-mb-3">
                    Password
                </Typography>
                <Input
                    type="password"
                    size="lg"
                    placeholder="********"
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