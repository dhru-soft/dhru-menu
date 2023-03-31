import React, {useEffect, useState} from "react";

import {Field, Form} from 'react-final-form'
import {ACTIONS, device, localredux, METHOD, required, STATUS, urls} from "../../lib/static";
import BodyClassName from 'react-body-classname';
import Footer from "../Navigation/Footer";
import Image from "../../components/Image";
import Theme from "../Home/Theme";
import {clone, isEmpty, sessionRetrieve} from "../../lib/functions";
import {useParams} from "react-router-dom";
import apiService from "../../lib/api-service";

const Index = (props) => {

    const params = useParams()
    device.feedbackid = params?.feedbackid;


    const [loading,setLoading] = useState(false);
    const [selectedQns,setSelectedQns] = useState();
    const [categories,setCategories] = useState([]);
    const [selectedEmoji,setSelectedEmoji] = useState(3);
    const [emojiexp,setEmojiExp] = useState([])

    const [feedbacks,setFeedbacks] = useState()


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
        apiService({
            method: METHOD.GET,
            action: ACTIONS.FEEDBACK,
            queryString: {feedbackid:device.feedbackid},
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && Boolean(result?.data)) {
                let feedback = Object.values(result.data.feedback)[1];

                await setFeedbacks(feedback || {})
                setSelectedQns(0)
                setLoading(true)

            }
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

    const handleCheckboxChange = (key,e) => {
        categories[key].selected = e.target.checked
        setCategories(clone(categories))
    }

    const {feedbackName,feedbackQuestions} = feedbacks;
    const totalqns = feedbacks?.feedbackQuestions?.length - 1;

    let {question,ratingStyle} = feedbackQuestions[selectedQns];


    const onSubmit = (values) => {
        apiService({
            method: METHOD.POST,
            action: ACTIONS.FEEDBACK,
             body:values,
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
            await setSelectedQns(selectedQns + 1)
        }

    }




    return (
        <BodyClassName className={'feedback'}>
            <>

                <Theme/>

            <div className="position-relative   h-100">
                <div className={'container p-4'}>
                    <div className="row justify-content-xl-between pt-5">
                        <div className="m-auto" style={{maxWidth:360}}>

                            <Form
                                initialValues={{...feedbacks}}
                                onSubmit={onSubmit}
                                render={({handleSubmit, values}) => {


                                    return (
                                        <form onSubmit={handleSubmit}>

                                            <div className={'form'}>


                                                <h3 className={'text-center'}>{feedbackName}</h3>
                                                <h4  className={'text-center mb-5'}>{question}</h4>

                                                <div className={'d-flex justify-content-between m-auto'}
                                                     style={{width: 330}}>
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

                                                <div className="section-heading section-heading--center">
                                                    <h5>{emojiexp[selectedEmoji]}</h5>
                                                </div>


                                                {
                                                   Boolean(setCategories?.length) && categories?.map((option, key) => {
                                                        const {name, selected} = option;
                                                        return (
                                                            <div className={`mb-2 p-4 rounded-3 bg-white`} key={key}>
                                                                <div key={key}
                                                                     className={'d-flex justify-content-between'}>

                                                                    <div>
                                                                        <div className="form-check">
                                                                            <input className="form-check-input"
                                                                                   type="checkbox" checked={selected}
                                                                                   value="1"
                                                                                   id={`checkbox${key}`}
                                                                                   onChange={(e) => handleCheckboxChange(key, e)}/>
                                                                            <label className="form-check-label"
                                                                                   htmlFor={`checkbox${key}`}>
                                                                                {`${name}`}
                                                                            </label>
                                                                        </div>
                                                                        <div>

                                                                        </div>
                                                                    </div>


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


                                                <div className={'d-flex justify-content-between'}>

                                                    {selectedQns !== 0 && <><button
                                                        className="w-100 custom-btn custom-btn--large custom-btn--style-1"
                                                        style={{height: 45}}
                                                        onClick={() => {
                                                            moveToStep(values,'prev')
                                                        }} type="button" role="button">
                                                        Previous
                                                    </button>

                                                    <div style={{width:10}}></div>

                                                    </>}

                                                    {(selectedQns === totalqns) ? <button
                                                        className="w-100 custom-btn custom-btn--large custom-btn--style-1"
                                                        style={{height: 45}}
                                                        onClick={() => {
                                                            onSubmit(values)
                                                        }} type="button" role="button">
                                                        Submit
                                                    </button>

                                                    :

                                                    <button
                                                        className="w-100 custom-btn custom-btn--large custom-btn--style-1"
                                                        style={{height: 45}}
                                                        onClick={() => {
                                                            moveToStep(values,'next')
                                                        }} type="button" role="button">
                                                         Next
                                                    </button> }


                                                </div>

                                            </div>

                                        </form>
                                    )
                                }}
                            />


                        </div>
                    </div>
                </div>

            </div>

                <Footer/>
            </>
        </BodyClassName>
    )


}



export default  Index;
