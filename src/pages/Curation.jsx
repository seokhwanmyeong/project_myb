import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actionCreators as postActions } from "../redux/modules/post";
import { ImgBenefit, ModalPop, FolderBg, Spinner } from '../components/index';
import { SvgLockOn, SvgLockOff } from '../icons/ico_components'

const Curation = () => {
    const userId = useSelector(state => state.user.user.userId);
    const folder_list = useSelector(state => state.post.folder_list);
    const user_folder = useSelector(state => state.user.user_folder);
    const loading = useSelector(state => state.post.is_loading);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const modalRef = useRef();
    const [folderId, setId] = useState();
    const [folderName, setName] = useState();
    const [lockstatus, setLock] = useState();
    // const [lockState, setLock] = useState(true);

    let lock_list = [];
    user_folder?.forEach(cur => {
        if(cur.folderId){
            return lock_list = [...lock_list, cur.folderId];
        }
    })
    // console.log(lock_list)

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
        // e.stopPropagation();
        // console.log(e.currentTarget)
        // if(e.currentTarget.classList.contains('on')){
        //     e.currentTarget.classList.remove('on')
        //     lock_list = lock_list.filter(cur => {
        //         return cur !== folderId
        //     })
        //     console.log(lock_list)
        //     dispatch(postActions.setUpdateFolderFB(folderId, folder_name, status));
        // }else{
        //     e.currentTarget.classList.add('on')
        //     lock_list = [...lock_list, folderId]
        //     console.log(lock_list)
        //     dispatch(postActions.setUpdateFolderFB(folderId, folder_name, status));
        // }
    }

    useEffect(() => {
        dispatch(postActions.getCurationFB());
    }, [])

    if(loading){
        return <Spinner type='page'/>;
    }return (
        <CurationWrap>
            <CurationTitle>
                <p>다른분들은</p>
                <p>이렇게 정책을 찜하고 계시네요!</p>
            </CurationTitle>
            <CurationBest>
                {folder_list.map((cur, idx) => {
                    if(idx >= 2){
                        return null;
                    }else{
                        return(
                            <BestCard key={cur.folderId} onClick={() => navigate(`/folder/${cur.folderId}`, {state: {folder_name: cur.folder_name}})}>
                                <FolderBg cate={{c1: cur.c1, c2: cur.c2, c3: cur.c3, c4: cur.c4}}/>
                                <FolderCont padding='0'>
                                    <FolderName color='white'>{cur.folder_name}</FolderName>
                                    {userId === cur.userId 
                                    ? 
                                    <FolderContBot>
                                        <FolderStatus color='white' onClick={(e) => ModalHandler(e, cur.folderId, cur.folder_name, cur.folder_status)}>편집</FolderStatus>
                                        <Deco color='white'/>
                                        <LockBtn color='white' onClick={(e) => lockFolderEvent(e, cur.folderId, cur.folder_name, cur.folder_status)}>
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
                                    : <FolderNick color='white'>{cur.nickname}</FolderNick>
                                    }
                                </FolderCont>
                                <FolderIcon>
                                    <ImgBenefit benefit={cur.benefit}/>
                                </FolderIcon>
                            </BestCard>
                        )
                    }
                })}
            </CurationBest>
            <FolderGroup>
                {folder_list.map((cur, idx) => {
                    if(idx < 2){
                        return null;
                    }else{
                        return(
                            <FolderList key={cur.folderId} onClick={() => navigate(`/folder/${cur.folderId}`, {state: {folder_name: cur.folder_name}})}>
                                <FolderImg>
                                    <FolderBg cate={{c1: cur.c1, c2: cur.c2, c3: cur.c3, c4: cur.c4}}/>
                                    <ImgBenefit benefit={cur.benefit}/>
                                </FolderImg>
                                <FolderCont>
                                    <FolderName>{cur.folder_name}</FolderName>
                                    <FolderCont padding='0'>
                                        {userId === cur.userId 
                                        ? 
                                        <FolderContBot>
                                            <FolderStatus onClick={(e) => ModalHandler(e, cur.folderId, cur.folder_name)}>편집</FolderStatus>
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
                                        : <FolderNick>{cur.nickname}</FolderNick>
                                        }
                                    </FolderCont>
                                </FolderCont>
                            </FolderList>
                        )
                    }
                })}
            </FolderGroup>
            <ModalPop ref={modalRef} modalId={3} folderId={folderId} folder_name={folderName} lockstatus={lockstatus}/>
        </CurationWrap>
    );
};
const CurationWrap = styled.div`
    padding: 5.6rem 10.4rem;
    @media screen and (max-width: 808px) {
        padding: 5.6rem 1.4rem;
    } 
`
const CurationTitle = styled.div`
    margin: 0 0 2.4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    p{
        font: ${props => props.theme.font.styleh3};
        color: ${props => props.theme.color.b0};
    }
`
const FolderGroup = styled.ul`
    display: flex;
    flex-wrap: wrap;
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
    z-index: 2;
    padding: ${props => props.padding ? props.padding : '0.8rem 1.6rem'};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const FolderStatus = styled.div`
    font: ${props => props.theme.font.curation_author};
    color ${props => props.color === 'white' ? props.theme.color.w : props.theme.color.p2};
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
    color ${props => props.color === 'white' ? props.theme.color.w : props.theme.color.b0};
`
const FolderNick = styled.p`
    font: ${props => props.theme.font.curation_author};
    color: ${props => props.color === 'white' ? props.theme.color.w : props.theme.color.b0};
`
const CurationBest = styled.div`
    margin: 0 0 6.2rem;
    display: flex;
    justify-content: space-between;
`
const BestCard = styled.div`
    position: relative;
    padding: 3.2rem 2.4rem;
    display: flex;
    width: 45%;
    height: 18.8rem;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
`
const LockBtn = styled.button`
    display: flex;
    align-items: center;
    svg{
        width: 1.067rem;
        height: 1.067rem;
        path{
            fill: ${props => props.color === 'white' ? props.theme.color.w : null};
        }
    }
    font: ${props => props.theme.font.p};
    color ${props => props.color === 'white' ? props.theme.color.w : props.theme.color.p2};
    svg+span{
        margin: 0 0 0 2px;
    }
`
const Deco = styled.div`
    content:"";
    margin: 0 1.4rem;
    display: inline-flex;
    width: 2px;
    height: 1.2rem;
    background-color: ${props => props.color === 'white' ? props.theme.color.w : props.theme.color.p2};
    pointer-events: none;
`
const FolderContBot = styled.div`
    display: flex;
    align-items: center;
`
const FolderIcon = styled.div`
    svg{
        position: absolute;
        right: 0;
        bottom: 1rem;
        width: 44.445%;
        height: auto;
        path{
            fill: ${props => props.theme.color.w};
        }
    }
`


export default Curation;