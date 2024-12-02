import React, { useEffect, useState } from 'react';
import { Button, Hero, Modal } from 'react-daisyui';

const ModalNotify: React.FC<{}> = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const hasViewedModal = localStorage.getItem('hasViewedModal');
    if (!hasViewedModal) {
      setVisible(true);
      localStorage.setItem('hasViewedModal', 'true');
    }
  }, []);

  const handleCloseModal = () => {
    setVisible(false);
  };

  return (
    <div>
      <div className=" font-sans">
        <Modal.Legacy
          open={visible}
          onClickBackdrop={toggleVisible}
          className="rounded-md"
        >
          <Modal.Header className="text-center font-bold">
            Xin chào!
          </Modal.Header>
          <Modal.Body>
            <Hero
              style={{
                backgroundImage:
                  'url(https://cdn.dribbble.com/userupload/7143226/file/original-0925d800240f43680473c0753133bf0c.png?resize=752x)'
              }}
              className="rounded-md"
            >
              <Hero.Overlay />
              <Hero.Content className="text-center">
                <div className="max-w-md">
                  <h1 className="text-5xl font-bold text-white">Admin</h1>
                  <p className="py-6 text-white">
                    Bạn có thể xem thống kê doanh thu, số lượng Bill... và quản
                    trí chi nhánh, tài khoản người dùng.
                  </p>

                  <Button
                    color="primary"
                    className="text-white"
                    onClick={handleCloseModal}
                  >
                    Đã hiểu
                  </Button>
                </div>
              </Hero.Content>
            </Hero>
          </Modal.Body>
        </Modal.Legacy>
      </div>
    </div>
  );
};

export default ModalNotify;
