
import { Phase } from './types';

export const ROADMAP_DATA: Phase[] = [
  {
    id: 1,
    month: 1,
    title: "The Foundation",
    focus: "Networking & OS Security",
    icon: "🌐",
    description: "Before defending a system, you must understand how it talks and how it breathes. This month focuses on the core plumbing of IT.",
    topics: [
      { 
        name: "OSI Model", 
        tooltip: "Open Systems Interconnection model: A conceptual framework used to understand network interactions in seven layers.",
        resources: ["Cloudflare: What is the OSI Model?", "Professor Messer's Network+ Videos"] 
      },
      { 
        name: "TCP/IP Suite", 
        tooltip: "The conceptual model and set of communications protocols used in the Internet and similar computer networks.",
        resources: ["RFC 793 (TCP Spec)", "Wireshark University: TCP Deep Dive"] 
      },
      { 
        name: "Linux Command Line", 
        tooltip: "The primary interface for managing servers, automating tasks, and performing security audits.",
        resources: ["OverTheWire: Bandit Wargame", "Linux Journey (Free Course)"] 
      },
      { 
        name: "Windows Internals", 
        tooltip: "Understanding processes, threads, memory management, and security descriptors within Windows.",
        resources: ["Microsoft Learn: Windows Architecture", "Sysinternals Documentation"] 
      },
      { 
        name: "Basic Scripting", 
        tooltip: "Automation is key. Python and Bash allow for rapid tool development and log parsing.",
        resources: ["Automate the Boring Stuff with Python", "Bash Academy"] 
      }
    ],
    milestones: [
      { 
        id: "m1-1", 
        title: "Complete Cisco Networking Basics", 
        description: "Master IP addressing, subnetting, and protocols.", 
        completed: false,
        guide: [
          "IP Addressing: Understand IPv4 (32-bit) vs IPv6 (128-bit). Learn the difference between Public and Private (RFC 1918) addresses.",
          "Subnetting: Master the 'Magic Number' method. Convert CIDR (e.g., /24) to Subnet Masks (255.255.255.0).",
          "Protocols: Study HTTP (80), HTTPS (443), SSH (22), DNS (53), and DHCP (67/68). Learn how the 3-Way Handshake (SYN -> SYN/ACK -> ACK) works."
        ]
      },
      { 
        id: "m1-2", 
        title: "Linux Power User & Hardening", 
        description: "Learn CLI and implement 'Hard Mode' security procedures.", 
        completed: false,
        guide: [
          "Root Restriction: Disable direct root login in /etc/ssh/sshd_config. Use 'sudo' for everything.",
          "Password Policy: Implement libpam-cracklib and set minimum length (14+) and complexity in /etc/pam.d/common-password.",
          "Filesystem Hardening: Mount /tmp and /var/tmp with 'noexec', 'nosuid', and 'nodev' options in /etc/fstab.",
          "Kernel Hardening: Configure /etc/sysctl.conf to ignore ICMP redirects and enable ASLR (Address Space Layout Randomization)."
        ]
      },
      { 
        id: "m1-3", 
        title: "Virtualization Setup (Proxmox)", 
        description: "Deploy a high-performance home lab using Proxmox VE.", 
        completed: false,
        guide: [
          "Hardware Check: Ensure VT-x or AMD-V is enabled in your BIOS.",
          "Installation: Burn Proxmox ISO to USB using Rufus or BalenaEtcher. Boot and follow the Debian-based installer.",
          "Network Config: Create a Linux Bridge (vmbr0) for management and a separate bridge (vmbr1) for your 'Dark Net' lab subnet.",
          "Storage: Setup ZFS for data integrity or LVM-Thin for snapshots. Snapshot your VMs before running any malware!"
        ]
      }
    ],
    labs: [
      { 
        title: "Packet Hunting", 
        tools: ["Wireshark", "tcpdump"], 
        objective: "Analyze a PCAP file to identify an unencrypted login session.", 
        difficulty: "Easy",
        tooltip: "Hands-on traffic analysis to find plaintext credentials in transit."
      },
      { 
        title: "Hardening Linux", 
        tools: ["SSH", "UFW", "Systemd"], 
        objective: "Secure a fresh Ubuntu install by disabling services and configuring firewall rules.", 
        difficulty: "Medium",
        tooltip: "System administration task focusing on reducing the attack surface of a server."
      }
    ],
    project: {
      title: "The Ultimate Home Lab",
      description: "Build a multi-OS environment consisting of a pfSense firewall, a Kali Linux attacker machine, and a Windows Server target.",
      deliverables: ["Network Diagram", "Firewall Rule List", "Lab Connectivity Test Report"]
    }
  },
  {
    id: 2,
    month: 2,
    title: "Defense & Operations",
    focus: "SOC, SIEM & Incident Response",
    icon: "🛡️",
    description: "Shifting from setup to monitoring. Learn to spot the 'smoke' before the 'fire' through logging and analysis.",
    topics: [
      { 
        name: "SIEM", 
        tooltip: "Security Information and Event Management: Tools providing real-time analysis of security alerts.",
        resources: ["Elastic Security Guide", "Wazuh Documentation"] 
      },
      { 
        name: "Log Analysis", 
        tooltip: "Reviewing computer-generated event logs to identify patterns and potential security threats.",
        resources: ["SANS Institute: Log Management Gold Standard", "Splunk Fundamentals"] 
      },
      { 
        name: "EDR", 
        tooltip: "Endpoint Detection and Response: Technology that monitors end-user devices for cyber threats.",
        resources: ["CrowdStrike: What is EDR?", "Open Source EDR: Velociraptor"] 
      }
    ],
    milestones: [
      { id: "m2-1", title: "Deploy a SIEM", description: "Install Wazuh or the ELK stack in your home lab.", completed: false },
      { id: "m2-2", title: "Log Ingestion", description: "Feed Windows Event Logs and Syslog into your SIEM.", completed: false },
      { id: "m2-3", title: "Crypto Challenge", description: "Solve 5 basic CTF-style cryptography problems.", completed: false }
    ],
    labs: [
      { 
        title: "The Brute Force Detector", 
        tools: ["Wazuh", "Hydra"], 
        objective: "Perform a brute force attack on your own server and create a SIEM alert to block the IP.", 
        difficulty: "Medium",
        tooltip: "Automated threat detection and response using modern SIEM correlation rules."
      },
      { 
        title: "Memory Forensics", 
        tools: ["Volatility"], 
        objective: "Extract password hashes from a memory dump of a compromised machine.", 
        difficulty: "Hard",
        tooltip: "Advanced forensic analysis of volatile memory (RAM) to recover artifacts."
      }
    ],
    project: {
      title: "Active Monitoring Dashboard",
      description: "Create a real-time SOC dashboard using Grafana that visualizes failed SSH logins and unauthorized file changes.",
      deliverables: ["JSON Dashboard Export", "Detection Logic Explanation", "Incident Report Sample"]
    }
  },
  {
    id: 3,
    month: 3,
    title: "Offense & Specialization",
    focus: "Penetration Testing & Web Sec",
    icon: "⚔️",
    description: "Thinking like an attacker to build better defenses. Exploring vulnerabilities and cloud environments.",
    topics: [
      { 
        name: "Vulnerability Assessment", 
        tooltip: "The process of identifying, quantifying, and prioritizing vulnerabilities in a system.",
        resources: ["Nessus Free Guide", "Qualys Community Edition"] 
      },
      { 
        name: "OWASP Top 10", 
        tooltip: "Standard awareness document for developers and web application security representing the most critical risks.",
        resources: ["OWASP Official Documentation", "PortSwigger Web Security Academy"] 
      },
      { 
        name: "Cloud Security", 
        tooltip: "Securing data, applications, and infrastructure in environments like AWS, Azure, and GCP.",
        resources: ["AWS Security Fundamentals", "Microsoft SC-900 Exam Topics"] 
      }
    ],
    milestones: [
      { id: "m3-1", title: "Web App Hacking Basics", description: "Understand SQLi, XSS, and IDOR.", completed: false },
      { id: "m3-2", title: "Cloud IAM Hardening", description: "Learn the principle of least privilege in AWS/Azure.", completed: false },
      { id: "m3-3", title: "Policy Writing", description: "Draft a basic Acceptable Use Policy (AUP).", completed: false }
    ],
    labs: [
      { 
        title: "Juice Shop Exploitation", 
        tools: ["Burp Suite", "OWASP Juice Shop"], 
        objective: "Perform a successful SQL injection to login as 'admin' without a password.", 
        difficulty: "Medium",
        tooltip: "Practical web application penetration testing using the industry-standard proxy tool."
      },
      { 
        title: "Metasploit Mastery", 
        tools: ["Metasploit", "Nmap"], 
        objective: "Identify a service vulnerability and execute a reverse shell payload.", 
        difficulty: "Hard",
        tooltip: "Learning the exploitation lifecycle from reconnaissance to post-exploitation."
      }
    ],
    project: {
      title: "Full Scope Pen Test",
      description: "Conduct a black-box penetration test on a vulnerable VM (like Metasploitable) and document every finding.",
      deliverables: ["Professional Pen-Test Report", "Remediation Guide", "Risk Matrix"]
    }
  }
];
