import React, { useState, useEffect } from 'react';
import { Fade, Button } from '@mui/material';
import { useParams } from 'react-router-dom';


import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Stack,
    CircularProgress
} from '@mui/material';
import '../styles/ActivityDetail1.css'; // Optional: For further custom CSS enhancements

import { getActivityDetail } from '../services/api';

const activityFacts = {
    RUNNING: [
        "Running helps improve cardiovascular health and endurance.",
        "Consistent running can boost mental health and reduce stress.",
        "Proper running shoes can prevent injuries and improve performance.",
        "Running burns approximately 100 calories per mile.",
        "Adding intervals can increase speed and stamina.",
        "Running outdoors boosts vitamin D intake from sunlight.",
        "Maintaining good form reduces risk of joint pain.",
        "Warm-ups and cool-downs are critical to prevent muscle strain.",
        "Hydration is key for optimal running performance.",
        "Running on varied terrain improves strength and balance.",
        "Strength training complements running for injury prevention.",
        "Rest days are essential to allow your body to recover."
    ],
    CYCLING: [
        "Cycling is a low-impact exercise suitable for all fitness levels.",
        "Regular cycling strengthens leg muscles and improves joint mobility.",
        "Cycling can burn between 400-1000 calories per hour depending on intensity.",
        "Wearing a helmet reduces risk of head injury significantly.",
        "Proper bike fit prevents back and knee pain.",
        "Indoor cycling can provide a high-intensity workout year-round.",
        "Cycling improves cardiovascular fitness and lung capacity.",
        "Using gears efficiently enhances endurance and speed.",
        "Cycling reduces stress on weight-bearing joints compared to running.",
        "Maintaining cadence around 70-90 rpm increases efficiency.",
        "Cross-training with cycling boosts overall fitness.",
        "Regular maintenance of your bike ensures smoother rides and safety."
    ],
    SWIMMING: [
        "Swimming provides a full-body workout engaging multiple muscle groups.",
        "It is a great low-impact exercise ideal for joint rehabilitation.",
        "Swimming improves lung capacity and cardiovascular endurance.",
        "Different strokes target different muscle groups for balanced strength.",
        "Swimming burns roughly 400-500 calories per hour.",
        "Consistent swimming increases flexibility and muscle tone.",
        "Warm-water swimming can help reduce muscle soreness.",
        "Swimming laps improves coordination and technique over time.",
        "Butterfly stroke is one of the most intense swimming styles.",
        "Safety: never swim alone and ensure lifeguard supervision.",
        "Using swim aids like kickboards helps isolate specific muscles.",
        "Breathing technique significantly affects swimming efficiency."
    ],
    WALKING: [
        "Walking daily reduces risk of chronic diseases like diabetes and heart disease.",
        "Brisk walking can burn up to 300 calories per hour.",
        "Good posture during walking prevents back and neck pain.",
        "Using a pedometer helps track progress and motivation.",
        "Walking in nature boosts mood and reduces anxiety.",
        "Walking strengthens bones and improves muscle endurance.",
        "Proper footwear can reduce foot problems and increase comfort.",
        "Interval walking with varying speed improves cardiovascular health.",
        "Walking supports joint mobility and reduces stiffness.",
        "Maintaining a steady cadence helps prevent fatigue.",
        "Walking after meals aids digestion and blood sugar control.",
        "Walking groups provide social support and boost exercise adherence."
    ],
    STRETCHING: [
        "Stretching improves flexibility and reduces muscle tension.",
        "Dynamic stretching before workouts prepares muscles for activity.",
        "Static stretching post-workout aids in recovery and reduces soreness.",
        "Consistent stretching enhances range of motion and joint health.",
        "Stretching helps prevent injuries by improving muscle elasticity.",
        "Breathing deeply during stretching enhances relaxation and effectiveness.",
        "Avoid bouncing during static stretches to prevent muscle strain.",
        "Incorporate full-body stretches for balanced flexibility.",
        "Yoga combines stretching with breathing and mindfulness.",
        "Holding stretches for 20-30 seconds gives best results.",
        "Stretch regularly, even on rest days, to maintain mobility.",
        "Stretching improves circulation and reduces muscle cramps."
    ]
};



const ActivityDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fact, setFact] = useState('');
    const [factIndex, setFactIndex] = useState(0);
    const [showFact, setShowFact] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getActivityDetail(id);
                setData(res.data);
                console.log('Activity Detail Data:', res.data);
            } catch (err) {
                console.error("Failed to fetch activity detail:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    useEffect(() => {
        if (data && data.activityType) {
            showRandomFact(data.activityType);
        }
        // eslint-disable-next-line
    }, [data?.activityType]);

    const activityFactIcons = {
        RUNNING: <span role="img" aria-label="runner">🏃‍♂️</span>,
        CYCLING: <span role="img" aria-label="cyclist">🚴‍♀️</span>,
        WALKING: <span role="img" aria-label="walker">🚶‍♂️</span>,
        SWIMMING: <span role="img" aria-label="swimmer">🏊‍♂️</span>,
        STRETCHING: <span role="img" aria-label="yoga">🧘‍♂️</span>,
    };

    const activityFactColors = {
        RUNNING: "#ffe0e0",
        CYCLING: "#e3f2fd",
        WALKING: "#f4ffea",
        SWIMMING: "#e3fafd",
        STRETCHING: "#f3e5f5",
    };

    const showRandomFact = (type) => {
        const factsArr = activityFacts[type] || ["Stay active for a healthy life!"];
        let newIdx = Math.floor(Math.random() * factsArr.length);
        // Avoid repeating same fact
        if (factsArr.length > 1 && newIdx === factIndex) {
            newIdx = (newIdx + 1) % factsArr.length;
        }
        setFactIndex(newIdx);
        setShowFact(false);
        setTimeout(() => {
            setFact(factsArr[newIdx]);
            setShowFact(true);
        }, 200);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
        </Box>
    );

    if (!data) return (
        <Typography sx={{ mt: 5, textAlign: 'center' }}>
            No data available.
        </Typography>
    );

    return (
        <Box sx={{
            maxWidth: 900,
            mx: 'auto',
            p: { xs: 2, sm: 3 },
        }}>

            {/* Activity Details Card */}
            <Card
                sx={{
                    mb: 3,
                    bgcolor: 'rgba(255,255,255,0.92)',
                    borderRadius: 4,
                    boxShadow: '0 4px 32px 0 rgba(30, 41, 59, 0.16), 0 2px 8px rgba(30,41,59,0.10)',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.25s cubic-bezier(.4,2,.6,.9)',
                    '&:hover': {
                        boxShadow: '0 16px 64px 0 rgba(30, 41, 59, 0.23), 0 4px 16px rgba(30,41,59,0.08)',
                    }
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: '#1976d2',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textShadow: '0 1px 12px rgba(25,118,210,0.06)'
                        }}
                    >
                        Activity Details
                    </Typography>
                    <Divider sx={{ mb: 2, opacity: 0.7 }} />
                    <Stack spacing={1.2}>
                        <Typography>Type: <strong>{data.activityType}</strong></Typography>
                        <Typography>Duration: <strong>{data.duration} minutes</strong></Typography>
                        {/* <Typography>Calories Burned: <strong>{data.caloriesBurned}</strong></Typography> */}
                        <Typography>Date: <strong>{new Date(data.createdAt).toLocaleString()}</strong></Typography>
                    </Stack>
                </CardContent>
            </Card>

            {/* AI Analysis and Recommendations Card */}
            <Card
                sx={{
                    bgcolor: 'rgba(255,255,255,0.92)',
                    borderRadius: 4,
                    boxShadow: '0 4px 32px 0 rgba(30, 41, 59, 0.16), 0 2px 8px rgba(30,41,59,0.10)',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.25s cubic-bezier(.4,2,.6,.9)',
                    '&:hover': {
                        boxShadow: '0 16px 64px 0 rgba(30, 41, 59, 0.23), 0 4px 16px rgba(30,41,59,0.08)',
                    }
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: '#1976d2',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textShadow: '0 1px 12px rgba(25,118,210,0.06)'
                        }}
                    >
                        AI Analysis & Recommendation
                    </Typography>
                    <Divider sx={{ mb: 2, opacity: 0.7 }} />

                    {/* ANALYSIS */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 700, color: '#24315e', mb: 1.5, letterSpacing: '0.03em' }}
                    >
                        Analysis
                    </Typography>
                    {data.recommendation?.split('\n\n').map((para, index) => (
                        <Typography key={index} paragraph sx={{ color: '#333', lineHeight: 1.7, fontSize: '1.02em' }}>
                            {para}
                        </Typography>
                    ))}


                    {/* Calories Burned */}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#24315e', mt: 3 }}>
                        Calories Burned
                    </Typography>
                    <Typography sx={{ color: '#333', lineHeight: 1.7, fontSize: '1.02em' }}>
                        {data.caloriesBurned || "No data available"}
                    </Typography>





                    {/* AREAS FOR IMPROVEMENT */}
                    {data.improvement?.length > 0 && (
                        <>
                            <Divider sx={{ my: 3, opacity: 0.5 }} />
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: 700, color: '#24315e', mb: 1.5, letterSpacing: '0.03em' }}
                            >
                                Areas for Improvement
                            </Typography>
                            {data.improvement.map((item, index) => (
                                <Typography key={index} sx={{ mb: 2, pl: 0, color: '#3a3a3a' }}>
                                    • {item}
                                </Typography>
                            ))}
                        </>
                    )}


                    {/* SUGGESTED WORKOUTS */}
                    {data.suggestions?.length > 0 && (
                        <>
                            <Divider sx={{ my: 3, opacity: 0.5 }} />
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: 700, color: '#24315e', mb: 1.5, letterSpacing: '0.03em' }}
                            >
                                Suggested Workouts
                            </Typography>
                            {data.suggestions.map((item, index) => (
                                <Typography key={index} sx={{ mb: 2, pl: 0, color: '#3a3a3a' }}>
                                    • {item}
                                </Typography>
                            ))}
                        </>
                    )}



                    {/* SAFETY TIPS */}
                    {data.safety?.length > 0 && (
                        <>
                            <Divider sx={{ my: 3, opacity: 0.5 }} />
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#24315e', mb: 1.5 }}>
                                Safety Tips
                            </Typography>
                            {data.safety.map((tip, index) => (
                                <Typography key={index} sx={{ mb: 2, pl: 0, color: '#3a3a3a' }}>
                                    • {tip}
                                </Typography>
                            ))}
                        </>
                    )}


                    {/* SUMMERY*/}
                    {data.summary?.length > 0 && (
                        <>
                            <Divider sx={{ my: 3, opacity: 0.5 }} />
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#24315e' }}>
                                Summary
                            </Typography>
                            {data.summary.map((item, index) => (
                                <Typography key={index} sx={{ mb: 0.6, pl: 2, borderLeft: '4px solid #54a0ff', color: '#3a3a3a' }}>
                                    • {item}
                                </Typography>
                            ))}
                        </>
                    )}

                    <Card
                        sx={{
                            mb: 3,
                            mt: 2,
                            bgcolor: activityFactColors[data.activityType] || '#f7fcff',
                            borderLeft: '8px solid #1976d2',
                            borderRadius: 3,
                            boxShadow: '0 2px 8px #bec6cf',
                            minHeight: 90
                        }}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <span style={{ fontSize: 26, marginRight: 8 }}>
                                    {activityFactIcons[data.activityType] || ''}
                                </span>
                                <Typography variant="h6" color="primary">
                                    Fun Fact
                                </Typography>
                            </Box>
                            <Fade in={showFact} timeout={300}>
                                <Typography sx={{ fontStyle: 'italic', fontSize: 17 }}>
                                    {fact}
                                </Typography>
                            </Fade>
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => showRandomFact(data.activityType)}
                            >
                                Show Another Fact
                            </Button>
                        </CardContent>
                    </Card>



                </CardContent>
            </Card>
        </Box>
    );
};

export default ActivityDetail;
