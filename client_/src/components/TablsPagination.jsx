import * as React from 'react';
import {useState} from 'react';
import {Pagination, Stack} from '@mui/material';


const TablsPagination = ({page, pagesFunction, limit, totalCount}) => {
    const [currentPage, setCurrentPage] = useState(page);
    const pageCount = Math.ceil(totalCount / limit)
    const handleChange = (event, value) => {
        setCurrentPage(value);
        pagesFunction(value)
    };
    return (
        <Stack spacing={2} sx={{my: 2}}>
            <Pagination color='warning'
                        count={pageCount}
                        page={currentPage}
                        onChange={handleChange}/>
        </Stack>

    );
}
export default TablsPagination
