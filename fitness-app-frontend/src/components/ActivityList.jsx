import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid2 from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getActivities } from '../services/api';
import { deleteActivity, deleteRecommendationByActivityId } from '../services/api';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedActivityId, setSelectedActivityId] = useState(null);
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            const response = await getActivities();
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // Handler for opening menu
    const handleMenuOpen = (event, activityId) => {
        setAnchorEl(event.currentTarget);
        setSelectedActivityId(activityId);
    };

    // Handler for closing menu
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedActivityId(null);
    };

    // Delete handler
    const handleDelete = async () => {
        try {
            await Promise.all([
                deleteActivity(selectedActivityId),
                deleteRecommendationByActivityId(selectedActivityId)
            ]);
            setActivities((prev) => prev.filter(a => a.id !== selectedActivityId));
            handleMenuClose();
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    };



    return (
        <Grid2 container spacing={2}>
            {activities.map((activity) => (
                <Grid2 key={activity.id} xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            cursor: 'pointer',
                            position: 'relative',
                            '&:hover .activity-delete-btn': { display: 'block' }
                        }}
                        onClick={() => navigate(`/activities/${activity.id}`)}
                    >
                        <IconButton
                            className="activity-delete-btn"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                display: 'none',
                                zIndex: 2,
                                bgcolor: 'background.paper',
                                '&:hover': { bgcolor: 'error.light' }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, activity.id);
                            }}
                        >
                            <DeleteIcon color="error" />
                        </IconButton>
                        <CardContent>
                            <Typography variant="h6">{activity.type}</Typography>
                            <Typography>Duration: {activity.duration} minutes</Typography>
                            <Typography>Weight (kg): {activity.weight}</Typography>
                            <Typography>Height (cm): {activity.height}</Typography>
                            <Typography>Gender: {activity.gender}</Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            ))}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClick={e => e.stopPropagation()}
            >
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </Grid2>
    );
};



export default ActivityList;