"use client";
import React, { useState } from "react";

const Playlist = ({ playListData, onPlayListChange, onClickRow }) => {

  const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: [],
  };

  const [list, setList] = useState(playListData);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);
  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: list,
    });

    event.dataTransfer.setData("text/html", "");
  };

  const onDragOver = (event) => {
    event.preventDefault();

    let newList = dragAndDrop.originalOrder;
    const draggedFrom = dragAndDrop.draggedFrom;
    const draggedTo = Number(event.currentTarget.dataset.position);

    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter(
      (item, index) => index !== draggedFrom
    );

    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newList,
        draggedTo: draggedTo,
      });
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    const dropPos = parseInt(event.currentTarget.dataset.position);
    if (dropPos !== 0) {
      setList(dragAndDrop.updatedOrder);

      setDragAndDrop({
        ...dragAndDrop,
        draggedFrom: null,
        draggedTo: null,
        isDragging: false,
      });
      onPlayListChange(dragAndDrop.updatedOrder)
    }
  };

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };

  function DragIndicatorIcon() {
    return (
      <svg
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="0.5"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          d="M9.16536 15C9.16536 15.9167 8.41536 16.6667 7.4987 16.6667C6.58203 16.6667 5.83203 15.9167 5.83203 15C5.83203 14.0834 6.58203 13.3334 7.4987 13.3334C8.41536 13.3334 9.16536 14.0834 9.16536 15ZM7.4987 8.33337C6.58203 8.33337 5.83203 9.08337 5.83203 10C5.83203 10.9167 6.58203 11.6667 7.4987 11.6667C8.41536 11.6667 9.16536 10.9167 9.16536 10C9.16536 9.08337 8.41536 8.33337 7.4987 8.33337ZM7.4987 3.33337C6.58203 3.33337 5.83203 4.08337 5.83203 5.00004C5.83203 5.91671 6.58203 6.66671 7.4987 6.66671C8.41536 6.66671 9.16536 5.91671 9.16536 5.00004C9.16536 4.08337 8.41536 3.33337 7.4987 3.33337ZM12.4987 6.66671C13.4154 6.66671 14.1654 5.91671 14.1654 5.00004C14.1654 4.08337 13.4154 3.33337 12.4987 3.33337C11.582 3.33337 10.832 4.08337 10.832 5.00004C10.832 5.91671 11.582 6.66671 12.4987 6.66671ZM12.4987 8.33337C11.582 8.33337 10.832 9.08337 10.832 10C10.832 10.9167 11.582 11.6667 12.4987 11.6667C13.4154 11.6667 14.1654 10.9167 14.1654 10C14.1654 9.08337 13.4154 8.33337 12.4987 8.33337ZM12.4987 13.3334C11.582 13.3334 10.832 14.0834 10.832 15C10.832 15.9167 11.582 16.6667 12.4987 16.6667C13.4154 16.6667 14.1654 15.9167 14.1654 15C14.1654 14.0834 13.4154 13.3334 12.4987 13.3334Z"
          fill="black"
        />
      </svg>
    );
  }

  const onClickPlayList = (index) => {

    onClickRow(index);
  }

  return (

    <section>
      <div className="divide-y divide-gray-400  rounded-md border border-gray-500">
        <div className="divide-y divide-gray-300 bg-white rounded-md ">
          {list?.map((item, index) => (
            <div key={index}>
              <div
                key={index}
                data-position={index}
                draggable={index !== 0}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragLeave={onDragLeave}
                className={
                  dragAndDrop && dragAndDrop.draggedTo === Number(index)
                    ? "dropArea p-4 flex justify-between items-center hover:bg-gray-100 0 cursor-pointer"
                    : " p-4 flex justify-between items-center hover:bg-gray-100 0 cursor-pointer"
                }
                onClick={() => onClickPlayList(index)}
              >

                <p>
                  {item.title}
                </p>
                <div>
                  <DragIndicatorIcon />
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Playlist;


// const [videos, setVideos] = useState(playListData);

// const [draggedItem, setDraggedItem] = useState(null);

// const handleDragStart = (event, index) => {
//   setDraggedItem(videos[index]);
//   event.dataTransfer.effectAllowed = "move";
//   event.dataTransfer.setData("text/html", event.target.parentNode);
//   event.dataTransfer.setDragImage(event.target.parentNode, 20, 20);
// };

// const handleDragOver = (index) => {
//   const draggedOverItem = videos[index];
//   if (draggedItem === draggedOverItem) return;
//   const items = videos.filter((item) => item !== draggedItem);
//   items.splice(index, 0, draggedItem);
//   setVideos(items);
//   onPlayListChange(items);
// };

// const handleDragEnd = () => {
//   setDraggedItem(null);
// };

// <div>
//   {videos.map((video, index) => (
//     <div
//       key={video.id}
//       draggable
//       onDragStart={(event) => handleDragStart(event, index)}
//       onDragOver={() => handleDragOver(index)}
//       onDragEnd={handleDragEnd}
//       onClick={() => onPlayListChange(video)}
//       className="playlist-item"
//     >
//       {video.title}
//     </div>
//   ))}
// </div>