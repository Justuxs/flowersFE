import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {Button, TextareaAutosize} from "@mui/material";
import HoverRating from "@/components/HoverRating";
import {useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";
import {getError} from "@/utils/error";
import endpoints from "@/pages/api/endpoints/endpoints";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({orderID, productID, reviewer, isActive}) {
    const [open, setOpen] = React.useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [rating, setRating] = useState(4);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(isActive);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleSendReview = async () => {
        if (textareaValue.length > 200) {
            toast.error("Comment is to long");
            return;
        }
        if (rating > 5 || rating < 0) {
            toast.error("Rating value is out of scope");
            return;
        }

        setLoading(true);
        const response = await axios.post(endpoints.review, {
            rate: rating,
            comment: textareaValue,
            productID: productID,
            orderItemID: orderID,
            reviewer: reviewer

        });
        setLoading(false);
        if (!(response.status === 201)) {
            toast.error(getError("Failed to create order"));
        }

        setActive(false);
        setOpen(false);

    };

    const handleTextareaChange = (event) => {
        let text = event.target.value.toString();
        console.log(text.length);
        if (text.length > 200) {
            toast.error("Comment is to long");
            return;
        } else {
            setTextareaValue(text);
        }

    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    return (
        <div>
            {
                active ?
                    <button className="primary-button w-full" onClick={handleClickOpen}>
                        Write review
                    </button> :
                    <button className="green-primary-button w-full" >
                        Reviewed
                    </button>
            }

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Review"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        How would you rate our product?
                    </DialogContentText>
                    <HoverRating value={rating} onChange={handleRatingChange}/>
                </DialogContent>

                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Please leave a comment
                    </DialogContentText>
                    <TextareaAutosize
                        autoFocus
                        id="name"
                        aria-label="Comment"
                        placeholder="Comment"
                        rowsMin={2}
                        style={{width: '100%', marginTop: '10px'}}
                        inputProps={{
                            maxLength: 200,
                        }}
                        onChange={handleTextareaChange}
                    />
                </DialogContent>
                {loading ?
                    <div>Sending...</div> :
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSendReview}>Send</Button>
                    </DialogActions>}
            </Dialog>
        </div>
    );
}