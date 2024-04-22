'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from './page.module.scss';
import UserApiClient from '@/api/clients/user';
import { setUser } from '@/redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { usePathname, useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();
    const path = usePathname();
    const userState = useAppSelector((state) => state.userSlice.user);
    
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    useEffect(() => {
        const handleRouteChange = (url: string) => {
          if (userState && url) {
            router.push(`${userState?.id}/docs/`);
          }
        };

        handleRouteChange(path);
        
      }, [userState, path, router]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
            const user = await UserApiClient.login(email, password);
            dispatch(setUser(user));
            router.push(`${userState?.id}/docs/`);

        } catch (error) {
            alert(`Login failed ${error}`);
            return;
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.formBox}>
                <h3>WriteIt!</h3>
                <h1 className={styles.title}>Login to your account</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" className={styles.email} onChange={handleEmailChange} required/>
                    <input type="password" placeholder="Password" className={styles.password} onChange={handlePasswordChange}required/>
                    <button type="submit" className={styles.btn}>Login</button>
                </form>
            </div>
            <div className={styles.bg}></div>
        </div>
    );
};

export default LoginPage;
