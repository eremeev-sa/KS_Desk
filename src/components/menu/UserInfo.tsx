import React from "react";
import { Group, Text, Button, Box } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

type UserInfoProps = {
  userName: string | undefined; // Имя пользователя
  onLogout: () => void; // Функция для выхода из системы
};

const UserInfo: React.FC<UserInfoProps> = ({ userName, onLogout }) => {
  return (
    <Group maw={130} pos={'absolute'} justify='space-between' w={240} wrap="nowrap" bottom={10} p="sm" pt='0' mah={'70px'}>
      <Group align="start"miw={140} maw={140} >
        {/* Имя пользователя с иконкой */}
        <Text size="md" fw={400}>
          {userName}
        </Text>
      </Group>

      <Group align="end" miw={100} maw={100}>
        {/* Кнопка выхода */}
        <Button
          variant="subtle"
          color="red"
          onClick={onLogout}
          size="sm"
        >
          <IconLogout size={16} />
        </Button>
      </Group>
    </Group >
  );
};

export default UserInfo;