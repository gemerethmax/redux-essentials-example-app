import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectAllUsers } from '../users/usersSlice';

import { userLoggedIn } from './authSlice';

interface LoginPageForFields extends HTMLFormControlsCollection {
    username: HTMLSelectElement;
}

interface LoginPageFormElement extends HTMLFormElement {
    readonly elements: LoginPageForFields
}

export const LoginPage = () => {
const dispatch = useAppDispatch(); 
const users = useAppSelector(selectAllUsers);
const navigate = useNavigate();

const handleSubmit = (e: React.FormEvent<LoginPageFormElement>) => {
    e.preventDefault()

    const username = e.currentTarget.elements.username.value
    dispatch(userLoggedIn(username))
    navigate('/posts')
}

const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>
        {user.name}
    </option>
))

return (
    <section>
        <h2>Welcome to Tweeter!</h2>
        <h3>Please Log in:</h3>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">User:</label>
            <select id="username" name="username" required>
                <option value=""></option>
                {userOptions}
            </select>
            <button>Log In</button>
        </form>
    </section>
)

}