"use client";
import React from 'react';

import { useState } from "react";
import { videoPlayerConst } from "../constant/videoPlayerConstant";
import VideoPlayer from '../component/videoPlayer/videoPlayer';
import Playlist from '../component/playlist/playList';

const HomeDashboard = () => {
    const [playList, setPlayList] = useState(videoPlayerConst.mediaJSON)
    const [clickRow, setClickRow] = useState();

    const onChangePlayList = (newPlayList) => {
        setPlayList(newPlayList);
    }

    const onClickRow = (index) => {
        setClickRow(index)
    }

    return (

        <div className='flex flex-col'>
            <div className="flex items-center">
                <div className='w-10/12'>
                    <VideoPlayer playListData={playList} clickRow={clickRow}/>
                </div>
            </div>
            <div className='my-2 border-y-2 border-gray-400 w-full '></div>
            <div className="flex flex-col mt-4">
                <div className='w-3/4'>
                    <h1 className='font-semibold text-xl'>PlayList</h1>
                    <Playlist playListData={playList} onPlayListChange={onChangePlayList} onClickRow={onClickRow}/>
                </div>
            </div>
        </div>
    )
}

export default HomeDashboard;