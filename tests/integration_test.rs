// tests/integration_test.rs
#[test]
fn test_cli_help() {
    let mut cmd = std::process::Command::new("cargo");
    cmd.arg("run").arg("--").arg("--help");
    let output = cmd.output().expect("failed to execute");
    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(stdout.contains("Proxmox Monitor"));
}