import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Modal from "./style/Modal.style";
import MenuSelect from "./MenuSelect";
import { TiDelete } from "react-icons/ti";
import { actionCreateProduct } from "../../../../redux/action/productAction";
import { createProduct } from "../../../../api/product";

const MenuModal = ({ title, closeModal }) => {
  const dispatch = useDispatch();

  const sizeOptions = ["선택없음", "Tall", "Large"];
  const tempOptions = ["선택없음", "Ice", "Hot"];
  const categoryOptions = ["선택없음", "에스프레소", "논커피", "스무디", "티", "에이드"];

  const formData = new FormData();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [temp, setTemp] = useState("");
  const [kcal, setKcal] = useState("");
  const [info, setInfo] = useState("");
  const [image, setImage] = useState("");
  const [bestCombo, setBestCombo] = useState("");

  formData.append("name", name);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("size", size);
  formData.append("temp", temp);
  formData.append("kcal", kcal);
  formData.append("info", info);
  formData.append("image", image);
  formData.append("bestCombo", bestCombo);

  const handleSubmit = (e) => {
    e.preventDefault();

    for (const pair of formData.entries()) {
      console.log("formDataPair", pair);
    }

    const fn = async () => {
      try {
        console.log("서버 전 데이터", formData);
        const newProduct = await createProduct(formData);
        console.log("서버에 전송된 데이터", newProduct);
        dispatch(actionCreateProduct(newProduct));
      } catch (err) {
        console.log("err");
      }
    };
    fn();
  };

  return (
    <Modal.ModalBackground>
      <Modal.ModalBox>
        <Modal.Title>
          <p>{title}</p>
          <TiDelete className="cancelIcon" onClick={closeModal} />
        </Modal.Title>
        <Modal.Form onSubmit={handleSubmit}>
          <Modal.P>
            <Modal.Label>이름 :</Modal.Label>
            <Modal.Input
              type="text"
              name="name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </Modal.P>
          <Modal.P>
            <Modal.Label>가격 :</Modal.Label>
            <Modal.InputContainer>
              <Modal.Input
                type="number"
                name="price"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                required
              />
              <Modal.CurrencyText>원</Modal.CurrencyText>
            </Modal.InputContainer>
          </Modal.P>
          <Modal.P>
            <Modal.Label>종류 :</Modal.Label>
            <MenuSelect
              options={categoryOptions}
              modal
              name="category"
              onChange={(selected) => {
                setCategory(selected);
              }}
            />
          </Modal.P>
          <Modal.P>
            <Modal.Label>사이즈 :</Modal.Label>
            <MenuSelect
              options={sizeOptions}
              modal
              name="size"
              onChange={(selected) => {
                setSize(selected);
              }}
            />
          </Modal.P>
          <Modal.P>
            <Modal.Label>ICE/HOT :</Modal.Label>
            <MenuSelect
              options={tempOptions}
              modal
              name="temp"
              onChange={(selected) => {
                setTemp(selected);
              }}
            />
          </Modal.P>
          <Modal.P>
            <Modal.Label>1회 제공량 :</Modal.Label>
            <Modal.InputContainer>
              <Modal.Input
                type="number"
                name="kcal"
                onChange={(e) => {
                  setKcal(e.target.value);
                }}
                required
              />
              <Modal.CurrencyText>kcal</Modal.CurrencyText>
            </Modal.InputContainer>
          </Modal.P>
          <Modal.TextareaBox>
            <Modal.Label>상세 설명 :</Modal.Label>
            <textarea
              name="info"
              cols="30"
              rows="3"
              onChange={(e) => {
                setInfo(e.target.value);
              }}
              required
            />
          </Modal.TextareaBox>
          <Modal.Label>사진 추가 :</Modal.Label>
          <Modal.ImgBox>
            <Modal.ImgLabel htmlFor="file">파일 선택</Modal.ImgLabel>
            <input
              type="file"
              id="file"
              name="image"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              required
            />
            <p>{image && image.name}</p>
          </Modal.ImgBox>
          <Modal.TextareaBox large>
            <Modal.Label>꿀조합 추천 정보 :</Modal.Label>
            <textarea
              name="bestCombo"
              cols="30"
              onChange={(e) => {
                setBestCombo(e.target.value);
              }}
              rows="3"
              required
            />
          </Modal.TextareaBox>
          <Modal.Submit type="submit" onClick={handleSubmit}>
            제출하기
          </Modal.Submit>
        </Modal.Form>
      </Modal.ModalBox>
    </Modal.ModalBackground>
  );
};

export default MenuModal;
