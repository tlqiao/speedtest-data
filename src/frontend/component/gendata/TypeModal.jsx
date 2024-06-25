import { useEffect, useMemo, useState } from 'react';
import '../../styles/modal.css';
import basicData from '../../constants/dataType.json';
import { groupBy } from 'lodash';
import { Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import cls from 'classnames';
import styles from './TypeModal.module.less';

const DataBlock = ({ data, onTypeClick }) => {
  const handleClick = (type) => () => {
    onTypeClick(type);
  };
  return data.map((item) => {
    return (
      <div
        key={item.id}
        className={styles.card}
        onClick={handleClick(item.label)}
      >
        <div className={styles.title}>{item.label}</div>
        <div className={styles.desc}>{item.description}</div>
        <div
          className={styles.desc}
          dangerouslySetInnerHTML={{ __html: item.examples }}
        />
      </div>
    );
  });
};

const TypeModal = ({ isOpen, onClose, onTypeSelected }) => {
  const [blockType, setBlockType] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState({});

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  const handleSideButtonClick = (key) => {
    setBlockType(key);
  };

  const handleTypeClick = (type) => {
    onTypeSelected(type);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSearchValue('');
  };

  useEffect(() => {
    if (isOpen) {
      const types = basicData.types;
      const grouped = groupBy(types, (i) => i.group);
      setData(grouped);
    }
  }, [isOpen]);

  const sliderList = useMemo(() => Object.keys(data), [data]);

  const currentData = useMemo(() => {
    const newData = blockType === 'all' ? basicData.types : data[blockType];

    return (newData || []).filter((i) =>
      i.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [blockType, searchValue, data]);

  return (
    <Modal
      className={styles.modal}
      wrapClassName={styles.modalWrap}
      width={1170}
      title={
        <div className={styles.header}>
          <div>Choose Type</div>
          <Input onChange={handleSearchChange} placeholder="Find Type..." prefix={<SearchOutlined />} />
        </div>
      }
      open={isOpen}
      footer={null}
      onCancel={handleClose}
    >
      <div className={styles.typeGroupList}>
        <div
          className={cls(styles.groupItem, {
            [styles.active]: blockType === 'all',
          })}
          onClick={() => handleSideButtonClick('all')}
        >
          All({basicData.types.length})
        </div>
        {sliderList.map((item) => (
          <div
            className={cls(styles.groupItem, {
              [styles.active]: blockType === item,
            })}
            key={item}
            onClick={() => handleSideButtonClick(item)}
          >
            {item}({data[item].length})
          </div>
        ))}
      </div>

      <div className={styles.list}>
        {currentData.length ? (
          <DataBlock data={currentData} onTypeClick={handleTypeClick} />
        ) : (
          <div>{` No types found matching "${searchValue}."`}</div>
        )}
      </div>
    </Modal>
  );
};

export default TypeModal;
