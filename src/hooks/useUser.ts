// useUser.ts
import { User } from '@supabase/supabase-js';
import { useState } from 'react';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
  };

  return { user, updateUser };
};
