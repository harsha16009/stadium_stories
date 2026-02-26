import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import "./Booking.css";

const API = "http://localhost:5000/api";

const STADIUMS = [
    {
        id: 'chinnaswamy',
        name: 'M. Chinnaswamy Stadium',
        city: 'Bengaluru',
        prices: { general: 1200, premium: 3500, vip: 9000 }
    },
    {
        id: 'wankhede',
        name: 'Wankhede Stadium',
        city: 'Mumbai',
        prices: { general: 1000, premium: 3000, vip: 8000 }
    },
    {
        id: 'eden',
        name: 'Eden Gardens',
        city: 'Kolkata',
        prices: { general: 800, premium: 2500, vip: 7000 }
    }
];

const TICKET_TYPES = [
    { id: 'general', name: 'General Stand', description: 'Regular seating with great view' },
    { id: 'premium', name: 'Premium Stand', description: 'Padded seats with better amenities' },
    { id: 'vip', name: 'VIP Box', description: 'Luxury experience with food and lounge' }
];

const Booking = () => {
    const [selectedStadium, setSelectedStadium] = useState(STADIUMS[0]);
    const [selectedTicketType, setSelectedTicketType] = useState('general');
    const [amount, setAmount] = useState(STADIUMS[0].prices.general);

    const [qrImage, setQrImage] = useState("");
    const [paymentLink, setPaymentLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("upi");

    // Update amount whenever stadium or ticket type changes
    useEffect(() => {
        const price = selectedStadium.prices[selectedTicketType];
        setAmount(price);
    }, [selectedStadium, selectedTicketType]);

    const safeAmount = useMemo(() => {
        const value = Number(amount);
        return Number.isFinite(value) && value > 0 ? value : 0;
    }, [amount]);

    const fee = useMemo(() => Number((safeAmount * 0.0125).toFixed(2)), [safeAmount]);
    const payable = useMemo(() => Number((safeAmount + fee).toFixed(2)), [safeAmount, fee]);

    const onProceed = async () => {
        setError("");
        setQrImage("");
        setPaymentLink("");

        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            setError("Please select a valid ticket");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${API}/payment/create-qr`, {
                amount: numericAmount,
                customer_details: {
                    customer_id: "USER_" + Date.now(),
                    customer_phone: "9999999999",
                    customer_name: "RCB Fan"
                }
            });

            const { qrCode, paymentLink: link } = res.data;
            setPaymentLink(link || "");

            if (qrCode) {
                setQrImage(qrCode);
            } else if (!link) {
                setError("Cashfree did not return a QR or payment link");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to create payment QR");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="booking-section" className="booking-container main-section standalone">
            <div className="section-title">
                <h2>TICKET BOOKING</h2>
                <p>Secure Your Spot in the Stadium</p>
            </div>

            <div className="booking-selection-grid animate-fade-in-up">
                {/* Stadium Selection */}
                <div className="selection-card">
                    <h3>1. Select Stadium</h3>
                    <div className="stadium-list">
                        {STADIUMS.map(stadium => (
                            <div
                                key={stadium.id}
                                className={`stadium-item ${selectedStadium.id === stadium.id ? 'active' : ''}`}
                                onClick={() => setSelectedStadium(stadium)}
                            >
                                <div className="stadium-info">
                                    <span className="stadium-name">{stadium.name}</span>
                                    <span className="stadium-city">{stadium.city}</span>
                                </div>
                                <div className="selection-indicator"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticket Type Selection */}
                <div className="selection-card">
                    <h3>2. Select Ticket Type</h3>
                    <div className="ticket-type-list">
                        {TICKET_TYPES.map(type => (
                            <div
                                key={type.id}
                                className={`ticket-type-item ${selectedTicketType === type.id ? 'active' : ''}`}
                                onClick={() => setSelectedTicketType(type.id)}
                            >
                                <div className="ticket-info">
                                    <span className="type-name">{type.name}</span>
                                    <span className="type-desc">{type.description}</span>
                                </div>
                                <div className="ticket-price">
                                    Rs {selectedStadium.prices[type.id]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="cf-shell-wrapper">
                <div className="cf-page">
                    <main className="cf-shell">
                        <section className="cf-left">
                            <header className="cf-header">
                                <div className="cf-logo-wrap">
                                    <div className="cf-logo-dot">C</div>
                                    <div>
                                        <p className="cf-brand">Cashfree Payments</p>
                                        <p className="cf-sub">Secure checkout</p>
                                    </div>
                                </div>
                                <div className="cf-chip">PCI DSS</div>
                            </header>

                            <div className="cf-card">
                                <h1 className="cf-title">Complete your booking</h1>
                                <p className="cf-copy">Pay safely with UPI, cards, wallets, and net banking.</p>

                                <div className="booking-summary-brief">
                                    <div className="summary-item">
                                        <span>Venue:</span>
                                        <strong>{selectedStadium.name}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Ticket:</span>
                                        <strong>{TICKET_TYPES.find(t => t.id === selectedTicketType).name}</strong>
                                    </div>
                                </div>

                                <div className="cf-methods">
                                    <button
                                        type="button"
                                        className={`cf-method ${selectedMethod === "upi" ? "active" : ""}`}
                                        onClick={() => setSelectedMethod("upi")}
                                    >
                                        UPI
                                    </button>
                                    <button
                                        type="button"
                                        className={`cf-method ${selectedMethod === "card" ? "active" : ""}`}
                                        onClick={() => setSelectedMethod("card")}
                                    >
                                        Cards
                                    </button>
                                </div>

                                <button
                                    onClick={onProceed}
                                    disabled={loading}
                                    className="cf-pay-btn"
                                >
                                    {loading ? "Creating QR..." : `Pay Rs ${payable.toFixed(2)}`}
                                </button>

                                {error && <p className="cf-error">{error}</p>}
                            </div>
                        </section>

                        <aside className="cf-right">
                            <div className="cf-summary">
                                <h2>Order Summary</h2>
                                <div className="cf-row">
                                    <span>Ticket Price</span>
                                    <strong>Rs {safeAmount.toFixed(2)}</strong>
                                </div>
                                <div className="cf-row">
                                    <span>Platform fee (1.25%)</span>
                                    <strong>Rs {fee.toFixed(2)}</strong>
                                </div>
                                <div className="cf-divider" />
                                <div className="cf-row cf-total">
                                    <span>Total payable</span>
                                    <strong>Rs {payable.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="cf-qr-box">
                                <p className="cf-qr-title">Scan to pay</p>
                                {qrImage ? (
                                    <img src={qrImage} alt="Cashfree payment QR" className="cf-qr-img" />
                                ) : (
                                    <div className="cf-qr-placeholder">Your payment QR will appear here</div>
                                )}

                                {paymentLink && (
                                    <a href={paymentLink} target="_blank" rel="noreferrer" className="cf-link-btn">
                                        Open payment link
                                    </a>
                                )}
                            </div>
                        </aside>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Booking;
