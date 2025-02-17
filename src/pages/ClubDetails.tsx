import React, { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Grid,
  Button,
  Fab,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import { getCurrentUser } from "../services/auth";
import { getClubDetails } from "../services/clubs";
import ErrorPage from "./ErrorPage";
import ClubBreadcrumbs from "../components/ClubBreadcrumbs";
import ActionButton from "../components/ActionButton";

interface ClubDetails {
  id: string;
  name: string;
  description?: string;
  role?: string;
}

function ClubDetails() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [club, setClub] = useState<ClubDetails | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        if (!clubId) {
          setError("Club ID is required");
          setLoading(false);
          return;
        }

        const user = await getCurrentUser();
        if (!user) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const hasClubAccess =
          user.systemRole === "admin" ||
          (user.clubs && user.clubs[clubId] !== undefined);
        setHasAccess(hasClubAccess);
        setUserRole(
          user.systemRole == "admin"
            ? "admin"
            : user.clubs[clubId]?.role || null
        );

        if (!hasClubAccess) {
          setError("You do not have permission to view this club");
          setLoading(false);
          return;
        }

        const clubData = await getClubDetails(clubId);
        setClub(clubData);
      } catch (err) {
        console.error("Error fetching club details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load club details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubId]);

  const handleNavigation = (path: string) => {
    navigate(`/clubs/${clubId}/${path}`);
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    if (error === "Authentication required") {
      return <Navigate to="/login" />;
    }
    if (!hasAccess) {
      return (
        <ErrorPage customMessage="You don't have permission to access this club" />
      );
    }
    return <ErrorPage customMessage={error} />;
  }

  if (!club) {
    return <ErrorPage customMessage="Club not found" />;
  }

  const navigationButtons = [
    {
      title: "Dashboard",
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      path: "dashboard",
    },
    {
      title: "Sessions",
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      path: "sessions",
    },
    {
      title: "Players",
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      path: "players",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
      <ClubBreadcrumbs clubId={clubId!} clubName={club.name} />
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: "linear-gradient(to bottom right, #ffffff, #f5f5f5)",
          borderRadius: 2,
          position: "relative",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #673ab7, #9c27b0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            {club.name}
          </Typography>
          {club.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {club.description}
            </Typography>
          )}

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {navigationButtons.map((button) => (
              <Grid item xs={12} md={4} key={button.title}>
                <Paper
                  elevation={2}
                  sx={{
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(103, 58, 183, 0.2)",
                    },
                  }}
                >
                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => handleNavigation(button.path)}
                    sx={{
                      p: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      backgroundColor: "#ffffff",
                      color: "#673ab7",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#ffffff",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 48,
                        color: "#673ab7",
                        transition: "transform 0.3s ease",
                      },
                      "&:hover .MuiSvgIcon-root": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    {button.icon}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        background: "linear-gradient(45deg, #673ab7, #9c27b0)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {button.title}
                    </Typography>
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Action Buttons */}
        {userRole === "admin" && (
          <Box
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              display: "flex",
              gap: 2,
            }}
          >
            <ActionButton
              title="Invite Player"
              onClick={() => navigate(`/clubs/${clubId}/newPlayer`)}
              icon={<PersonAddIcon />}
            />
            <ActionButton
              title="New Session"
              onClick={() => navigate(`/clubs/${clubId}/newSession`)}
              icon={<AddIcon />}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ClubDetails;
