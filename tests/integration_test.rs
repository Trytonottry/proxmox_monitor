// tests/integration_test.rs

#[test]
fn test_placeholder() {
    // Пока нет реальных тестов — просто заглушка
    assert!(true);
}

// Добавь реальные тесты позже, например:
//
// #[test]
// fn test_parse_node() {
//     let json = r#"{"node": "pve1", "status": "online", "cpu": 0.12}"#;
//     let node: models::Node = serde_json::from_str(json).unwrap();
//     assert_eq!(node.node, "pve1");
// }