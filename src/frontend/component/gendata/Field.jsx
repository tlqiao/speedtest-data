import { useState } from 'react';
import '../../styles/global.css';
import '../../styles/field.css';
import Modal from './TypeModal';
import {Button} from "antd";
import { CloseOutlined } from '@ant-design/icons';
import Options from './Options.jsx'

const ChooseTypeButton = ({ selectedType, setSelectedType }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const handleTypeSelected = (type) => {
        setSelectedType(type);
    };
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const showType =(selectedType) => {
        const displayType = selectedType.length > 15 ? `${selectedType.substring(0, 15)}...` : selectedType;
        return displayType;
    }
    return (
        <div>
            <button
                className="chooseTypeButton"
                onClick={openModal}
                value={selectedType}
            >
                {selectedType ? showType(selectedType) : 'Choose Type...'}
                <span className="dropdown-arrow">&#9660;</span>
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onTypeSelected={handleTypeSelected}
            />
        </div>
    );
};

const Field = ({ data, onRemove, onUpdate }) => {
    const handleOptionsUpdate = (updatedOptions) => {
        onUpdate({ ...data, options: updatedOptions });
    };
    const handleNameChange = (e) => {
        onUpdate({ ...data, name: e.target.value });
    };
    const handleTypeChange = (type) => {
        onUpdate({ ...data, type:type });
    };
    return (
        <div className="container">
            <input
                className="field-input"
                value={data.name}
                onChange={handleNameChange}
            />
            <ChooseTypeButton selectedType={data.type} setSelectedType={handleTypeChange} />
            <Options
                type={data.type}
                options={data.options}
                setOptions={handleOptionsUpdate}
            ></Options>
            <Button
                type="text"
                onClick={onRemove}
                icon={<CloseOutlined/>}
                style={{color: '#000'}}
            />
        </div>
    );
};

export default Field;
