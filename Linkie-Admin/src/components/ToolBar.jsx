import { Button} from 'antd';
import { BsPlusLg } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

function ToolBar() {

   

    return (
        <div className="w-full h-[4rem] bg-gray-200 flex justify-between items-center">
            <div className="w-1/5 h-full flex items-center justify-center">
                <Button
                    className='mx-3'
                    type="primary"
                    icon={<BsPlusLg />}
                >
                    New item
                </Button>

                <Button
                    className='mx-3'
                    disabled
                    icon={<MdDelete />
                    }
                >
                    Xóa
                </Button>

            </div>
            <div className="w-1/5 h-full flex items-center justify-center">


            </div>
        </div>
    );
}

export default ToolBar;
