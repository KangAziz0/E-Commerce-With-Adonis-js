import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { faqData, faqCategories, type FaqCategory } from "@/data/faq";
import "./FaqSection.css";

const ALL_CATEGORY = "Semua" as const;

type FilterCategory = typeof ALL_CATEGORY | FaqCategory;

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const answerVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};

const FaqSection = () => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const categories = useMemo(() => [ALL_CATEGORY, ...faqCategories], []);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return faqData.filter(({ category, question, answer }) => {
      const matchCategory = activeCategory === ALL_CATEGORY || category === activeCategory;
      const matchSearch =
        query.length === 0 ||
        question.toLowerCase().includes(query) ||
        answer.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const onCategorySelect = (category: FilterCategory) => {
    setActiveCategory(category);
    setActiveId(null);
  };

  return (
    <section className="faq-section">
      <Container>
        <Row className="g-4 align-items-start">
          <Col lg={8}>
            <div className="faq-header">
              <p className="faq-eyebrow">Frequently Asked Questions</p>
              <h2 className="faq-title">Pusat Bantuan Belanja</h2>
              <p className="faq-description">
                Jelajahi jawaban cepat untuk pertanyaan umum seputar pemesanan, pembayaran,
                pengiriman, dan pengembalian.
              </p>
            </div>

            <InputGroup className="faq-search-group">
              <Form.Control
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setActiveId(null);
                }}
                className="faq-search-input"
                aria-label="Cari pertanyaan FAQ"
              />
            </InputGroup>

            <div className="faq-filters" role="tablist" aria-label="Filter kategori FAQ">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`faq-filter-pill ${activeCategory === category ? "is-active" : ""}`}
                  onClick={() => onCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
              <span className="faq-result-count">{filteredFaqs.length} pertanyaan</span>
            </div>

            <div className="faq-list">
              {filteredFaqs.length === 0 ? (
                <div className="faq-empty-state">
                  <p className="mb-1 fw-semibold">Tidak ada pertanyaan yang cocok.</p>
                  <small>Coba kata kunci lain atau ganti kategori.</small>
                </div>
              ) : (
                filteredFaqs.map((item, index) => {
                  const isOpen = activeId === item.id;

                  return (
                    <motion.article
                      key={item.id}
                      className="faq-item"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.04, duration: 0.2, ease: "easeOut" }}
                    >
                      <button
                        type="button"
                        className="faq-item-trigger"
                        onClick={() => setActiveId(isOpen ? null : item.id)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${item.id}`}
                      >
                        <div>
                          <Badge bg="dark" className="faq-category-badge">
                            {item.category}
                          </Badge>
                          <p className="faq-question">{item.question}</p>
                        </div>
                        <span className={`faq-plus ${isOpen ? "is-open" : ""}`}>+</span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-answer-${item.id}`}
                            className="faq-answer-wrap"
                            variants={answerVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            transition={{ duration: 0.25, ease: "easeOut" }}
                          >
                            <p className="faq-answer">{item.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  );
                })
              )}
            </div>
          </Col>

          <Col lg={4}>
            <aside className="faq-support-card">
              <p className="faq-support-title">Butuh Bantuan Lain?</p>
              <p className="faq-support-description">
                Tim support siap membantu setiap hari pukul 08.00 - 21.00 WIB.
              </p>
              <div className="d-grid gap-2">
                <Button variant="dark">Live Chat</Button>
                <Button variant="outline-dark">Kirim Email</Button>
              </div>
            </aside>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FaqSection;
