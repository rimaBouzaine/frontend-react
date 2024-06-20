
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';


const Card = ({nameT, deleteConstraintTemplate , updateConstraintTemplate}) => {


    return (<div className="w-full flex h-16   border-collapse bg-gray-100 border-gray-400 border-1 hover:shadow-xl  hover:bg-gray-200 justify-between">
        <div className='p-4'>
            <h1> {nameT} </h1>
        </div>

        <div className="flex gap-4 p-4">
            <div >
                <IconButton color="primary" aria-label="add to shopping cart" onClick={()=>{
                    updateConstraintTemplate(nameT)
                }}>
                    <EditIcon />
                </IconButton>
            </div>
            <div>

                <IconButton color="primary" aria-label="add to shopping cart"  onClick={()=>{
                    deleteConstraintTemplate(nameT)
                }}  >
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>

    </div>)
}
export default Card;