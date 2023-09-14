import React, { Route, Routes } from 'react-router-dom';

import Error from '@/app/pages/error/error';
import CreateTopic from '@/app/pages/forum/createTopic/createTopic';
import Forum from '@/app/pages/forum/forum';
import Topic from '@/app/pages/forum/topic/topic';
import Game from '@/app/pages/game/game';
import Landing from '@/app/pages/landing/landing';
import LeaderBoard from '@/app/pages/leaderboard/leaderboard';
import Profile from '@/app/pages/profile/profile';
import Signin from '@/app/pages/signin/signin';
import Signup from '@/app/pages/signup/signup';

import Layout from '@/app/components/layout/layout';
import PrivateRoute from '../components/privateRoute/privateRoute';

export enum RoutePaths {
    LANDING = '/',
    FORUM__URL = '/forum',
    FORUM = '/forum/:page?',
    GAME = '/game',
    LEADERBOARD = '/leaderboard',
    PROFILE = '/profile',
    SIGNIN = '/signin',
    SIGNUP = '/signup',
    NOT_FOUND = '/*',
    SERVER_ERROR = '/500',
    CREATE_TOPIC = '/forum/topic/create',
    TOPIC = '/forum/topic/:id',
}

const Router = () => (
    <Routes>
        <Route element={<Layout />}>
            <Route path={RoutePaths.LANDING} element={<Landing />} />
            <Route path={RoutePaths.SIGNIN} element={<Signin />} />
            <Route path={RoutePaths.SIGNUP} element={<Signup />} />
            <Route path={RoutePaths.SERVER_ERROR} element={<Error code={500} />} />
            <Route path={RoutePaths.NOT_FOUND} element={<Error code={404} />} />
            <Route path={RoutePaths.GAME} element={<Game />} />
            <Route element={<PrivateRoute />}>
                <Route path={RoutePaths.FORUM} element={<Forum />} />
                <Route path={RoutePaths.CREATE_TOPIC} element={<CreateTopic />} />
                <Route path={RoutePaths.TOPIC} element={<Topic />} />
                <Route path={RoutePaths.PROFILE} element={<Profile />} />
                <Route path={RoutePaths.LEADERBOARD} element={<LeaderBoard />} />
            </Route>
        </Route>
    </Routes>
);

export default Router;
