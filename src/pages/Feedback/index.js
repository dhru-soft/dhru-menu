import React, {useEffect, useState} from "react";

import {Field, Form} from 'react-final-form'
import {ACTIONS, device, localredux, METHOD, required, STATUS, urls} from "../../lib/static";
import BodyClassName from 'react-body-classname';
import Footer from "../Navigation/Footer";
import Image from "../../components/Image";
import Theme from "../Home/Theme";
import {
    clone, getCompanyDetails,
    getDefaultCurrency,
    getInit,
    getWorkspaceName,
    isEmpty, numberFormat,
    sessionRetrieve,
    setTheme
} from "../../lib/functions";
import {useParams} from "react-router-dom";
import apiService from "../../lib/api-service";
import moment from "moment";
import Init from "../Home/Init";
import CompanyDetail from "../Navigation/CompanyDetail";

const Index = (props) => {

    const params = useParams()
    device.feedbackid = params?.feedbackid;


    const [loading,setLoading] = useState(false);
    const [selectedQns,setSelectedQns] = useState();
    const [categories,setCategories] = useState([]);
    const [selectedEmoji,setSelectedEmoji] = useState();
    const [emojiexp,setEmojiExp] = useState([])

    const [feedbacks,setFeedbacks] = useState()
    const [voucher,setVoucher] = useState()


    const setFeedbackOptions = () =>{
        if(!isEmpty(feedbacks)) {
            const {feedbackOptions,selectedOptions,star, followNegative, followPositive} = feedbacks?.feedbackQuestions[selectedQns] || {};

            setEmojiExp([followNegative, followNegative, followNegative, followPositive, followPositive])

            star && setSelectedEmoji(star)

            if(Boolean(selectedOptions)){
                setCategories(selectedOptions)
            }
            else if(!isEmpty(feedbackOptions)) {
                setCategories(feedbackOptions?.map((option) => {
                    return {name: option, selected: false}
                }))
            }
            else{
                setCategories([])
            }
        }
    }

    const getFeedbackQns = async () => {
        await getInit(getWorkspaceName()).then(()=>{ })
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.FEEDBACK,
            queryString: {feedbackid:device.feedbackid},
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                const {feedback,voucher} = result?.data || {}
                await setFeedbacks(feedback)
                await setVoucher(voucher)
                await setSelectedQns(0);
                device.locationid = voucher?.locationid
            }
            await setLoading(true);
        });
    }

    useEffect(()=>{
        getFeedbackQns().then()
    },[])


    useEffect(()=>{
        setFeedbackOptions()
    },[selectedQns])




    if(!loading){
        return <></>
    }

    if(!Boolean(feedbacks)){
        return <div className="section-heading section-heading--center">
            <h4
                className="__title">Opps! <div
                style={{color: '#ff0000'}}>Something went wrong</div></h4>
        </div>
    }

    const handleCheckboxChange = (key,e) => {
        categories[key].selected = e.target.checked
        setCategories(clone(categories))
    }

    const {feedbackName,feedbackQuestions} = feedbacks;
    const totalqns = feedbacks?.feedbackQuestions?.length - 1;

    let {question,ratingStyle,star,status} = feedbackQuestions[selectedQns];

    const onSubmit = (values) => {

        apiService({
            method: METHOD.POST,
            action: ACTIONS.FEEDBACK,
            body:values,
            workspace: device.workspace,
            token: device.token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                console.log('result?.data',result?.data)
            }
        });
    }

    const moveToStep = async (values,action) => {

        values.feedbackQuestions[selectedQns] = {
            ...values.feedbackQuestions[selectedQns],
            selectedOptions:categories,
            star:selectedEmoji
        }

        if (action === 'prev') {
           await setSelectedQns(selectedQns - 1)
        } else if (action === 'next') {
            values.feedbackQuestions[selectedQns] = {
                ...values.feedbackQuestions[selectedQns],
                 status:'completed'
            }
            await setSelectedQns(selectedQns + 1);
            if(!values.feedbackQuestions[selectedQns + 1]?.status){
                setSelectedEmoji(0)
            }
        }

    }


    const {clientname,date,location,vouchertotaldisplay,company} = voucher

    return (
        <BodyClassName className={'feedback'}>
            <>
                <CompanyDetail company={company}/>
                <div className={'container'}>
                    <div className="m-auto" style={{maxWidth:400}}>

                        <Form
                            initialValues={{...feedbacks}}
                            onSubmit={onSubmit}
                            render={({handleSubmit, values}) => {


                                return (
                                    <form onSubmit={handleSubmit}>

                                        <div className={'form'}>


                                            <div className={'d-flex justify-content-between align-items-center  px-4 my-3'}>
                                                <div>
                                                    <h5 className={'m-0'}>Hi! <span className={'text-muted'} style={{fontWeight:700}}>{clientname}</span> , your valuable feedback is important for us</h5>
                                                </div>
                                            </div>

                                            <div className={'d-flex justify-content-between align-items-center px-4'}>
                                                <div>
                                                    <small>Create Amount</small>
                                                    <h5  className={'m-0'}>{numberFormat(vouchertotaldisplay)}</h5>
                                                </div>
                                                <div>
                                                    <small>On</small>
                                                    <h5 className={'m-0'}>{moment(date).format('DD-MM-YYYY')}</h5>
                                                </div>
                                            </div>


                                            <div className={'p-5   border bg-white rounded-4 mt-3'}>

                                                <h4  className={'mb-5'}>{question}</h4>

                                                <div className={'d-flex justify-content-between m-auto'}
                                                     style={{maxWidth: 330}}>
                                                    {
                                                        emojiexp.map((emo, index) => {
                                                            return (
                                                                <div key={index}
                                                                     className={`cursor-pointer emoji ${(selectedEmoji - 1) === index ? 'active' : ''}`}
                                                                     onClick={() => {
                                                                         setSelectedEmoji(index + 1)
                                                                     }}><Image name={`${ratingStyle === 'number'?'score':'emoji'}_${index + 1}.svg`}/></div>
                                                            )
                                                        })
                                                    }
                                                </div>

                                                {Boolean(selectedEmoji) && <>
                                                    <div className="section-heading section-heading--center">
                                                        <h6>{emojiexp[selectedEmoji]}</h6>
                                                    </div>


                                                    {
                                                        Boolean(setCategories?.length) && categories?.map((option, key) => {
                                                            const {name, selected} = option;
                                                            return (
                                                                <div className={`mb-2 rounded-3 bg-white`} key={key}>
                                                                    <div className="form-check">
                                                                        <input className="form-check-input"
                                                                               type="checkbox" checked={selected}
                                                                               value="1"
                                                                               id={`checkbox${key}`}
                                                                               onChange={(e) => handleCheckboxChange(key, e)}/>
                                                                        <label className="form-check-label p-4"
                                                                               htmlFor={`checkbox${key}`}>
                                                                            {`${name}`}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }


                                                    <div className={'mt-5'}>
                                                        <div className={'mb-2'}>Describe your experience (optional)</div>
                                                        <Field name={`feedbackQuestions[${selectedQns}].comments`}>
                                                            {({input, meta}) => (
                                                                <div className="input-wrp">
                                                                <textarea className="textfield textfield3"
                                                                          type="text" {...input}
                                                                          placeholder="Add your comment"/>
                                                                </div>
                                                            )}
                                                        </Field>
                                                    </div>





                                                </>}

                                                <div className={'action-btn'}>

                                                    <div className={'d-flex justify-content-between'}>

                                                        {selectedQns !== 0 && <><button
                                                            className="w-100 custom-btn custom-btn--large custom-btn--style-2"
                                                            style={{height: 45}}
                                                            onClick={() => {
                                                                moveToStep(values,'prev')
                                                            }} type="button" role="button">
                                                            Previous
                                                        </button>

                                                            <div style={{width:10}}></div>

                                                        </>}

                                                        {(star || Boolean(selectedEmoji)) && <>
                                                            {(selectedQns === totalqns) ? <button
                                                                    className="w-100 custom-btn custom-btn--large custom-btn--style-4"
                                                                    style={{height: 45}}
                                                                    onClick={() => {
                                                                        onSubmit(values)
                                                                    }} type="button" role="button">
                                                                    Submit
                                                                </button>

                                                                :

                                                                <button
                                                                    className="w-100 custom-btn custom-btn--large custom-btn--style-4"
                                                                    style={{height: 45}}
                                                                    onClick={() => {
                                                                        moveToStep(values,'next')
                                                                    }} type="button" role="button">
                                                                    Next
                                                                </button> }
                                                        </>}

                                                    </div>
                                                </div>

                                            </div>


                                        </div>

                                    </form>
                                )
                            }}
                        />


                    </div>
                </div>
            </>
        </BodyClassName>
    )


}



export default  Index;
