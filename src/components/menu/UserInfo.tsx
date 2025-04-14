import React from "react";
import { Group, Text, Button, Box } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

type UserInfoProps = {
  userName: string; // Имя пользователя
  onLogout: () => void; // Функция для выхода из системы
};

const UserInfo: React.FC<UserInfoProps> = ({ userName, onLogout }) => {
  return (
    <Box pos={"absolute"} bottom={0} p="sm" pt='0' mah={'70px'}>
      <Group justify="space-between">
        {/* Имя пользователя с иконкой */}
        <Text size="md" maw={'120px'} fw={500}>
          {userName}
        </Text>

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
    </Box>
  );
};

export default UserInfo;