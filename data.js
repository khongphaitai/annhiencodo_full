/* ================================================================
   AN NHIÊN CỐ ĐÔ — FILE DỮ LIỆU  (data.js)
   ================================================================
   Mọi sản phẩm và combo đều nằm trong file này.
   Sửa giá / tên / mô tả / ảnh / quà tặng kèm -> chỉ sửa file này,
   KHÔNG cần đụng vào script.js, styles.css hay index.html.

   ----- GIẢI THÍCH CÁC DÒNG (để khỏi phải đoán) -----
   "cardTitle" : tên combo hiện trên thẻ ngoài trang
   "cardText"  : mô tả ngắn hiện trên thẻ
   "title"     : tiêu đề lớn trong popup
   "sub"       : dòng mô tả dưới tiêu đề trong popup
   "photo"     : ảnh chính (nằm trong thư mục assets/images)
   "pills"     : các nút dung tích / phân loại (to trước, nhỏ sau)
   "pillPhotos": ảnh đổi theo từng nút pills (chỉ cao tràm có)
   "thumbs"    : các ảnh nhỏ để khách bấm đổi mùi trong popup
   "photos"    : (chỉ nến thơm) 3 ảnh của 1 mùi, xếp theo đúng thứ tự
                 nút dung tích [gốm 275, thủy tinh 240, thủy tinh 170].
                 Chỗ nào chưa có ảnh thì để trống "" -> web tự hiện
                 ảnh "Ảnh đang cập nhật". Có ảnh rồi thì chỉ cần điền
                 đường dẫn vào giữa cặp dấu ngoặc kép đó.
   "rows"      : các mục nội dung trong popup combo
                 ("head" = tiêu đề mục, "body" = nội dung)

   ----- THÊM 1 COMBO MỚI -----
   1) Chép ảnh combo vào thư mục assets/images/
   2) Copy nguyên 1 khối combo (từ dòng "combo1" tới hết khối của nó),
      dán xuống dưới, đổi tên thành "combo3" (nhớ dấu phẩy ngăn cách)
   3) Sửa chữ trong khối mới theo combo của bạn
   4) Lưu file, up đúng file data.js này lên GitHub -> xong,
      thẻ combo ở mục "Các combo hiện có" tự xuất hiện.

   ----- XÓA 1 COMBO -----
   Xóa nguyên khối của nó trong file này là xong.
   (Hình tam giác ở mục "Combo & quà tặng" đang trỏ vào combo1;
   muốn gắn tam giác cho combo khác thì nhắn Muse nhé.)
   ================================================================ */

const PRODUCTS = {
  /* ==================== NẾN THƠM ==================== */
  "candle": {
    "title": "Nến thơm 8 mùi hương bản địa",
    "sub": "Cốc nến làm từ gốm và mùi hương Sứ tự nhiên",
    "photo": "assets/images/popup-candle-su-gom.jpg",
    "pills": [
      "Gốm 275 gr",
      "Thủy Tinh 240gr",
      "Thủy Tinh 170gr"
    ],
    "thumbs": [
      {
        "photo": "assets/images/popup-candle-su-gom.jpg",
        "title": "Nến thơm 8 mùi hương bản địa",
        "sub": "Cốc nến làm từ gốm và mùi hương Sứ tự nhiên",
        "photos": [
          "assets/images/popup-candle-su-gom.jpg",
          "assets/images/popup-candle-su-tt240.jpg",
          ""
        ]
      },
      {
        "photo": "assets/images/popup-candle-dinhhuong-gom.jpg",
        "title": "Nến thơm 8 mùi hương bản địa",
        "sub": "Cốc nến làm từ gốm và mùi hương Đinh Hương tự nhiên",
        "photos": [
          "assets/images/popup-candle-dinhhuong-gom.jpg",
          "assets/images/popup-candle-dinhhuong-tt240.jpg",
          "assets/images/popup-candle-dinhhuong-tt170.jpg"
        ]
      },
      {
        "photo": "assets/images/popup-candle-nhai-gom.jpg",
        "title": "Nến thơm 8 mùi hương bản địa",
        "sub": "Cốc nến làm từ gốm và mùi hương Nhài tự nhiên",
        "photos": [
          "assets/images/popup-candle-nhai-gom.jpg",
          "assets/images/popup-candle-nhai-tt240.jpg",
          ""
        ]
      },
      {
        "photo": "assets/images/popup-candle-que-gom.jpg",
        "title": "Nến thơm 8 mùi hương bản địa",
        "sub": "Cốc nến làm từ gốm và mùi hương Quế tự nhiên",
        "photos": [
          "assets/images/popup-candle-que-gom.jpg",
          "assets/images/popup-candle-que-tt240.jpg",
          "assets/images/popup-candle-que-tt170.jpg"
        ]
      },
      {
        "photo": "assets/images/popup-candle-sen-gom.jpg",
        "title": "Nến thơm 8 mùi hương bản địa",
        "sub": "Cốc nến làm từ gốm và mùi hương Sen tự nhiên",
        "photos": [
          "assets/images/popup-candle-sen-gom.jpg",
          "assets/images/popup-candle-sen-tt240.jpg",
          "assets/images/popup-candle-sen-tt170.jpg"
        ]
      },
      {
        "photo": "assets/images/popup-candle-buoi-tt240.jpg",
        "title": "Nến thơm 8 mùi hương bản địa",
        "sub": "Cốc nến làm từ gốm và mùi hương Bưởi tự nhiên",
        "photos": [
          "",
          "assets/images/popup-candle-buoi-tt240.jpg",
          "assets/images/popup-candle-buoi-tt170.jpg"
        ]
      },
      {
        "photo": "assets/images/popup-candle-sachanh-gom.jpg",
        "title": "Nến thơm 8 mùi hương bản địa",
        "sub": "Cốc nến làm từ gốm và mùi hương Sả Chanh tự nhiên",
        "photos": [
          "assets/images/popup-candle-sachanh-gom.jpg",
          "assets/images/popup-candle-sachanh-tt240.jpg",
          ""
        ]
      },
      {
        "photo": "assets/images/popup-candle-tram-gom.jpg",
        "title": "Nến thơm 8 mùi hương bản địa",
        "sub": "Cốc nến làm từ gốm và mùi hương Tràm tự nhiên",
        "photos": [
          "assets/images/popup-candle-tram-gom.jpg",
          "assets/images/popup-candle-tram-tt240.jpg",
          "assets/images/popup-candle-tram-tt170.jpg"
        ]
      }
    ]
  },
  /* ==================== TINH DẦU ==================== */
  "oil": {
    "title": "Tinh dầu thơm Cố Đô",
    "sub": "Đinh Hương — tinh dầu mùi gỗ quý hiếm.",
    "photo": "assets/images/popup-oil-main.jpg",
    "pills": [
      "50ml",
      "20ml"
    ],
    "thumbs": [
      {
        "photo": "assets/images/popup-oil-main.jpg",
        "title": "Tinh dầu thơm Cố Đô",
        "sub": "Đinh Hương — tinh dầu mùi gỗ quý hiếm."
      },
      {
        "photo": "assets/images/popup-oil-tram.jpg",
        "title": "Tinh dầu thơm Cố Đô",
        "sub": "Tràm — tinh dầu mùi gỗ ấm áp, thư giãn."
      },
      {
        "photo": "assets/images/popup-oil-tung.jpg",
        "title": "Tinh dầu thơm Cố Đô",
        "sub": "Tùng — tinh dầu mùi gỗ thanh mát, trong lành."
      },
      {
        "photo": "assets/images/popup-oil-que.jpg",
        "title": "Tinh dầu thơm Cố Đô",
        "sub": "Quế — tinh dầu mùi quế cay ấm, đậm hương Cố Đô."
      },
      {
        "photo": "assets/images/popup-oil-sachanh.jpg",
        "title": "Tinh dầu thơm Cố Đô",
        "sub": "Sả Chanh — tinh dầu tươi mát, sảng khoái."
      }
    ]
  },
  /* ==================== CAO TRÀM ==================== */
  "caotram": {
    "title": "Cao Tràm Thảo Mộc",
    "sub": "Cô đặc từ tinh túy tràm Huế và thảo mộc tự nhiên — dịu ấm, lành tính cho những ngày trở gió, tiện mang theo bên mình.",
    "photo": "assets/images/popup-caotram-30g.png",
    "pills": [
      "30g",
      "10g"
    ],
    "pillPhotos": [
      "assets/images/popup-caotram-30g.png",
      "assets/images/popup-caotram-10g.jpg"
    ],
    "thumbs": []
  }
};


const COMBOS = {
  /* ==================== COMBO 1 ==================== */
  "combo1": {
    "cardTitle": "Combo 1 — Hộp quà sang trọng",
    "cardText": "Cốc nến thơm kèm hộp diêm thủ công, thiệp cảm ơn viết tay và hộp quà trang trí chỉn chu — sẵn sàng để trao tặng.",
    "photo": "assets/images/featured-gift.jpg",
    "alt": "Combo 1 — Hộp quà sang trọng",
    "rows": [
      {
        "head": "Cốc nến & hộp diêm thủ công",
        "body": "Một cốc nến thơm cao cấp của An Nhiên Cố Đô (mùi hương tùy chọn) kèm hộp diêm thủ công, tiện dụng mỗi khi thắp nến."
      },
      {
        "head": "Thiệp cảm ơn & hướng dẫn sử dụng",
        "body": "Thiệp cảm ơn viết tay cùng tờ hướng dẫn sử dụng và bảo quản sản phẩm, giúp món quà thêm trọn vẹn và tinh tế."
      },
      {
        "head": "Hộp & đồ trang trí",
        "body": "Hộp quà sang trọng, trang trí chỉn chu với hoa khô và phụ kiện mang dấu ấn Cố Đô — sẵn sàng để trao tặng ngay."
      }
    ]
  }
};
