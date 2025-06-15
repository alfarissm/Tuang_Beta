export default function Styles() {
  return (
    <style>{`
      /* Badge Styling */
      .cart-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #53B175;
        color: white;
        border-radius: 50%;
        font-size: 0.75rem;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
      }
      
      /* Drawer Animation */
      .drawer.closed {
        display: none !important;
      }
      .drawer.open {
        display: block !important;
        animation: slideInDrawer 0.2s;
      }
      @keyframes slideInDrawer {
        from { right: -100vw; }
        to   { right: 0; }
      }
      
      /* Food Card Styling */
      .food-card {
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .food-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      
      /* Category Button Styling */
      .category-btn {
        transition: all 0.2s;
      }
      .category-btn:hover:not(.active) {
        background-color: #f3f4f6;
      }
      
      /* Responsive Adaptations */
      @media (max-width: 768px) {
        .drawer {
          width: 100vw !important;
          max-width: 100vw !important;
          min-width: 0 !important;
        }
        .cart-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        .category-btn {
          font-size: 0.85rem;
          padding: 0.25rem 0.75rem;
        }
        /* Maintain height proportion on small screens */
        .food-img {
          height: 140px !important;
        }
        .food-card-content {
          padding: 0.75rem !important;
        }
      }
      
      @media (max-width: 500px) {
        .drawer {
          padding: 0 !important;
        }
        .cart-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        .category-btn {
          font-size: 0.80rem;
          padding: 0.2rem 0.5rem;
        }
        /* Make food cards more compact on very small screens */
        .food-img {
          height: 120px !important;
        }
        .food-name {
          font-size: 0.95rem !important;
        }
        .food-price {
          font-size: 0.9rem !important;
        }
        .food-card-content {
          padding: 0.6rem !important;
        }
      }
    `}</style>
  );
}