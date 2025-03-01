import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Link as MuiLink,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { login, authError, isAuthenticating } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values.email, values.password);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "grid",
          gap: 3,
          justifyItems: "center",
        }}
      >
        <Typography component="h1" variant="h4">
          Sign In
        </Typography>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form style={{ width: "100%" }}>
              <Stack spacing={2}>
                {/* Email Field */}
                <Field name="email">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email Address"
                      autoComplete="email"
                      autoFocus
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                    />
                  )}
                </Field>

                {/* Password Field */}
                <Field name="password">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                    />
                  )}
                </Field>

                {/* Error Message */}
                {(errors.general || authError) && (
                  <Alert severity="error">{errors.general || authError}</Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting || isAuthenticating}
                >
                  {isSubmitting || isAuthenticating ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Links Section - CSS Grid Version */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 1,
                    justifyItems: { xs: "center", sm: "stretch" },
                  }}
                >
                  <MuiLink
                    component={Link}
                    to="/forgot-password"
                    variant="body2"
                    sx={{ justifySelf: { sm: "start" } }}
                  >
                    Forgot password?
                  </MuiLink>
                  <MuiLink
                    component={Link}
                    to="/register"
                    variant="body2"
                    sx={{ justifySelf: { sm: "end" } }}
                  >
                    Don't have an account? Sign Up
                  </MuiLink>
                </Box>

                {/* Alternative Stack Version for mobile */}
                {isMobile && (
                  <Stack spacing={1} alignItems="center">
                    <MuiLink
                      component={Link}
                      to="/forgot-password"
                      variant="body2"
                    >
                      Forgot password?
                    </MuiLink>
                    <MuiLink component={Link} to="/register" variant="body2">
                      Create new account
                    </MuiLink>
                  </Stack>
                )}
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default LoginPage;
