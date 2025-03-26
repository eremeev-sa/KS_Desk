import React, { useEffect, useState } from 'react';
import { getUsers, UserRequest } from '../services/User';
import { useUser } from '../context/UserContext';

import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';

interface LoginProps extends PaperProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, ...props }) => {
  const { setCurrentUser } = useUser(); // Функция для обновления глобального состояния пользователя
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [usersData, setUsersData] = useState<UserRequest[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsersData(users);
    };
    fetchUsers();
  }, []);

  const handleLogin = () => {
    const user = usersData.find(
      (u) => u.login === form.values.login && u.password === form.values.password
    );

    if (user) {
      setCurrentUser(user.name);
      onLogin();
    } else {
      alert('Неверный логин или пароль ' + user);
      console.log(user);
    }
  };

  const form = useForm({
    initialValues: {
      login: '',
      password: '',
    },
    validate: {
      login: (value: string) => (value.trim() ? null : 'Введите логин'),
      password: (value: string) => (value.trim() ? null : 'Введите пароль'),
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder {...props}>

      <TextInput
        required
        label="Логин"
        placeholder="Ваш логин"
        value={form.values.login}
        onChange={(event) => form.setFieldValue('login', event.currentTarget.value)}
        error={form.errors.email && 'Неверный логин'}
        radius="md"
      />

      <PasswordInput
        required
        label="Пароль"
        placeholder="Ваш пароль"
        value={form.values.password}
        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
        error={form.errors.password && 'Пароль должен включать не менее 6 символов'}
        radius="md"
      />

      <form onSubmit={form.onSubmit(() => { })}>
        <Group justify="space-between" mt="xl">
          <Button type="submit" onClick={handleLogin} radius="xl">
            {"Войти"}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

export default Login;