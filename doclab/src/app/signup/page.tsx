'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import styles from './page.module.scss';
import UserApiClient from '@/api/clients/user';
import { setUser } from '@/redux/slices/userSlice';
import { useState, ChangeEvent, FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const SignupPage = () => {
    const router = useRouter();
    const path = usePathname();
    const userState = useAppSelector((state) => state.userSlice);


    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setcPassword] = useState('');

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handlecPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setcPassword(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== cPassword) {
            alert('Passwords do not match');
            return;
        }
        try{
            const user = await UserApiClient.signup(email, password);
            dispatch(setUser(user));
            router.push(`${path}/${userState.user?.id}/docs/`);
        } catch (error) {
            alert(`Signup failed ${error}`);
            return;
        }
    };
    return (
        <div className={styles.signupPage}>
            <div className={styles.formBox}>
                <h3>WriteIt!</h3>
                <h1 className={styles.title}>Create a free account!</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" className={styles.email} onChange={handleEmailChange} required/>
                    <input type="password" placeholder="Password" className={styles.password} onChange={handlePasswordChange} required/>
                    <input type="password" placeholder="Confirm Password" className={styles.password} onChange={handlecPasswordChange} required/>
                    <button type="submit" className={styles.btn}>Signup</button>
                </form>
            </div>
            <div className={styles.bg}></div>
        </div>
    );
};

export default SignupPage;
