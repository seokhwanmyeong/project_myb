import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actionCreators as postActions } from "../redux/modules/post";
import { ImgBenefit, ModalPop, FolderBg, Spinner } from './index';
import { SvgLockOn, SvgLockOff } from '../icons/ico_components'

const Myzzim = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const data = useSelector((state) => state.post.my_folder_list);
    const loading = useSelector((state) => state.post.is_loading);
    const modalRef = useRef();
    const [folderId, setId] = useState();
    const [folderName, setName] = useState();
    const [lockstatus, setLock] = useState();

    const ModalHandler = (e, id, name, status) => {
        e.stopPropagation();
        modalRef.current.classList.contains("active")
        ? modalRef.current.classList.remove("active")
        : modalRef.current.classList.add("active")

        setId(id);
        setName(name);
        setLock(status);
    }

    const lockFolderEvent = (e, folderId, folder_name, folder_status) => {
        e.stopPropagation();
        dispatch(postActions.setUpdateFolderFB(folderId, folder_name, !folder_status))
    }

    useEffect(() => {
        dispatch(postActions.getFolderFB());
    }, [])

    if(loading){
        return <Spinner type='page'/>;
    }return (
        <React.Fragment>
            <FolderGroup>
                {data.map(cur => {
                    return(
                        <FolderList key={cur.folderId} onClick={() => navigate(`/folder/${cur.folderId}`, {state: {folder_name: cur.folder_name}})}>
                            <FolderImg>
                                <FolderBg cate={{c1: cur.c1, c2: cur.c2, c3: cur.c3, c4: cur.c4}}/>
                                <ImgBenefit benefit={cur.benefit}/>
                            </FolderImg>
                            <FolderCont>
                                <FolderName>{cur.folder_name}</FolderName>
                                <FolderContBot>
                                    <FolderStatus onClick={(e) => ModalHandler(e, cur.folderId, cur.folder_name, cur.folder_status)} className={cur.folder_status ? "active" : ""}>편집</FolderStatus>
                                    <Deco/>
                                    <LockBtn onClick={(e) => lockFolderEvent(e, cur.folderId, cur.folder_name, cur.folder_status)}>
                                        {cur.folder_status 
                                        ? <React.Fragment>
                                            <SvgLockOn/>
                                            <span>공개중</span>
                                        </React.Fragment>
                                        :<React.Fragment>
                                            <SvgLockOff/>
                                            <span>비공개</span>
                                        </React.Fragment>}
                                    </LockBtn>
                                </FolderContBot>
                            </FolderCont>
                        </FolderList>
                    )
                })}
            </FolderGroup>
            <ModalPop ref={modalRef} modalId={3} folderId={folderId} folder_name={folderName} lockstatus={lockstatus}/>
        </React.Fragment>
    );
};
const FolderGroup = styled.ul`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
`
const FolderList = styled.li`
    margin: 0 0 1.6rem;
    display: flex;
    width: 50%;
    cursor: pointer;
    @media screen and (max-width: 808px) {
    } 
    @media screen and (max-width: 600px) {
        width: 100%;
    } 
`
const FolderImg = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 12rem;
    height: 12rem;
    border-radius: 17.0936px;
    overflow: hidden;
    svg{
        z-index: 1;
        width: 10rem;
        height: 10rem;
        path{
            fill: ${props => props.theme.color.w};
        }
    }
`
const FolderCont = styled.div`
    padding: 0.8rem 1.6rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const FolderContBot = styled.div`
    display: flex;
    align-items: center;
`
const FolderStatus = styled.div`
    font: ${props => props.theme.font.curation_author};
    color ${props => props.theme.color.p2};
`
const FolderName = styled.h4`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font: ${props => props.theme.font.curation_title};
`
const LockBtn = styled.button`
    display: flex;
    align-items: center;
    svg{
        width: 1.067rem;
        heigth: 1.067rem;
    }
    font: ${props => props.theme.font.p};
    color ${props => props.theme.color.p2};
    svg+span{
        margin: 0 0 0 2px;
    }
`
const Deco = styled.div`
    content:"";
    margin: 0 1.4rem;
    display: inline-flex;
    width: 2px;
    height: 1rem; 
    background-color: ${props => props.theme.color.p2};
    pointer-events: none;
`
export default Myzzim;