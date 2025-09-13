import React, { useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
    const [activity, setActivity] = useState({
        type: "RUNNING",
        duration: '',
        caloriesBurned: '',
        additionalMetrics: {}
    });
    const [errors, setErrors] = useState({});

    // Acceptable ranges, adjust as needed:
    const validate = () => {
        const newErrors = {};
        if (!activity.duration || isNaN(Number(activity.duration)) || Number(activity.duration) <= 0 || Number(activity.duration) > 1440) {
            newErrors.duration = "Enter valid duration in minutes (1-1440)";
        }
        if (!activity.weight || isNaN(Number(activity.weight)) || Number(activity.weight) < 20 || Number(activity.weight) > 400) {
            newErrors.weight = "Enter valid weight in kg (20-400)";
        }
        if (!activity.height || isNaN(Number(activity.height)) || Number(activity.height) < 90 || Number(activity.height) > 272) {
            newErrors.height = "Enter valid height in cm (90-272)";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        try {
            await addActivity(activity);
            onActivityAdded();
            setActivity({
                type: "RUNNING",
                duration: '',
                caloriesBurned: '',
                additionalMetrics: {}
            });
        } catch (error) {
            console.error("Error adding activity:", error);
        }
    };


    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Activity Type</InputLabel>
                <Select
                    value={activity.type}
                    onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                >
                    <MenuItem value="RUNNING">Running</MenuItem>
                    <MenuItem value="CYCLING">Cycling</MenuItem>
                    <MenuItem value="SWIMMING">Swimming</MenuItem>
                    <MenuItem value="WALKING">Walking</MenuItem>
                    <MenuItem value="YOGA">Yoga</MenuItem>
                    <MenuItem value="STRETCHING">Stretching</MenuItem>

                </Select>
            </FormControl>

            <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                sx={{ mb: 2 }}
                value={activity.duration}
                error={!!errors.duration}
                helperText={errors.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
            />
            <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                sx={{ mb: 2 }}
                value={activity.weight}
                error={!!errors.weight}
                helperText={errors.weight}
                onChange={(e) => setActivity({ ...activity, weight: e.target.value })}
            />
            <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                sx={{ mb: 2 }}
                value={activity.height}
                error={!!errors.height}
                helperText={errors.height}
                onChange={(e) => setActivity({ ...activity, height: e.target.value })}
            />


            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                    value={activity.gender || ''}
                    label="Gender"
                    onChange={(e) => setActivity({ ...activity, gender: e.target.value })}
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
            </FormControl>


            <Button variant="contained" color="primary" type="submit">
                Add Activity
            </Button>
        </Box>
    );
};

export default ActivityForm;