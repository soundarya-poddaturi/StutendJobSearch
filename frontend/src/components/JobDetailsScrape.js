import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JobDetailsScrape = () => {
    const { jobUrl } = useParams(); // Capture the job URL from params
    console.log("Job URL:", jobUrl); // Debugging log to check the job URL

    const [jobHtml, setJobHtml] = useState('');
    const [cssStyles, setCssStyles] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                // Ensure jobUrl is properly encoded for use in a URL
                const encodedJobUrl = encodeURIComponent(jobUrl);
                console.log("Encoded job URL:", encodedJobUrl); // Debugging log
                const response = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/jobs/${encodedJobUrl}/`);
                console.log(response.data);

                // Assuming the job component HTML and CSS are returned in the response
                setJobHtml(response.data.job_component_html);
                setCssStyles(response.data.css_styles);
            } catch (err) {
                console.error("Error fetching job details:", err);
                setError('Error fetching scraped job details');
            } finally {
                setLoading(false);
            }
        };

        if (jobUrl) {
            fetchJobDetails();
        }
    }, [jobUrl]); // Only re-fetch if jobUrl changes

    if (loading) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-4">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <div className="shadow p-4 bg-white">
                <div className="card-body">
                    {/* Render CSS styles if available */}
                    {cssStyles && <div dangerouslySetInnerHTML={{ __html: cssStyles }} />}
                    
                    {/* If the job component HTML exists, render it */}
                    {jobHtml ? (
                        <div
                            className="job-details-component"
                            dangerouslySetInnerHTML={{ __html: jobHtml }}
                        />
                    ) : (
                        <p>No job details available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailsScrape;
