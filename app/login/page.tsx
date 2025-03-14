'use client';

import {
    Alert,
    Anchor,
    Button,
    Checkbox,
    Container,
    Paper,
    PasswordInput,
    Space,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const router = useRouter();
    const form = useForm({
        initialValues: {
            username: "",
            password: "",
            rememberMe: false,
        },
        validate: {
            username: (value) => (value.trim() ? null : "Username is required"),
            password: (value) => (value.trim() ? null : "Password is required"),
        },
    });

    const handleLogin = async () => {
        setErrorMessage(null);
        console.log("Logging in with:", form.values);

        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: form.values.username,
                password: form.values.password,
                rememberMe: form.values.rememberMe,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Login successful", data);
            if (data.expiresIn === "1 day") {
                console.log("Remember me is not checked, expired in: ", data.expiresIn);
                Cookies.set("token", data.token,
                    {
                        secure: true,
                        sameSite: "Strict",
                        expires: 1
                    });
            } else {
                console.log("Remember me is checked, expired in: ", data.expiresIn);
                Cookies.set("token", data.token,
                    {
                        secure: true,
                        sameSite: "Strict",
                        expires: 365 * 10
                    });
            }

            //redirect to reports
            router.push("/");
        } else {
            setErrorMessage("Invalid username or password.");
        }
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Report Tracker
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor href="/demo">Try Demo!</Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleLogin)}>
                    {errorMessage && (
                        <Alert color="red" title="Error" mb="md">
                            {errorMessage}
                        </Alert>
                    )}
                    <TextInput
                        label="Username"
                        placeholder="Your username"
                        {...form.getInputProps("username")}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        {...form.getInputProps("password")}
                        mt="md"
                    />
                    <Space h="md" />
                    <Checkbox label="Remember me" {...form.getInputProps("rememberMe", { type: "checkbox" })} />
                    <Button fullWidth mt="xl" type="submit">
                        Sign in
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}