import React, { useEffect, useState } from 'react';
import { getUsers, UserRequest } from '../services/User';
import { useUser } from '../context/UserContext';

import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Loader,
  LoadingOverlay,
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
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingStatus(true);
      const users: UserRequest[] = [
        {id: 'd848d900-a1db-4b86-a79d-c81ed6581e23', name: 'Alex', login: 'Merser', password: '12345', role: 'user'}, 
        {id: 'e726830a-3814-4762-b44a-adf033018baa', name: 'Ivan', login: 'Ivanov', password: '12345', role: 'user'},
        {id: '5a9ae92c-c463-4f97-a4eb-e35c5249db81', name: 'Иванов Иван Иванович', login: 'string', password: 'string', role: 'user'},
      ] // await getUsers();
      setUsersData(users);
      setLoadingStatus(false);
    };
    fetchUsers();
  }, []);

  const handleLogin = () => {
    const user = usersData.find(
      (u) => u.login === form.values.login && u.password === form.values.password
    );

    if (user) {
      setCurrentUser(user);
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
      {loadingStatus ?
        (
          <LoadingOverlay visible={loadingStatus} loaderProps={{
            children:
              <Loader size="xl" />
          }} />
        ) : (
          <form onSubmit={form.onSubmit(() => { })}>
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


            <Group justify="space-between" mt="xl">
              <Button type="submit" onClick={handleLogin} radius="xl">
                {"Войти"}
              </Button>
            </Group>
          </form>
        )
      }
    </Paper>
  );
}

export default Login;