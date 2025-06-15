#!/usr/bin/env python3
"""
Script to create test problems via API using admin Firebase token
"""
import requests
import json
import os
from datetime import datetime

def create_test_problems():
    """Create test problems using admin authentication"""
    
    # Test problems data
    problems = [
        {
            "title": "E-commerce Growth Strategy",
            "description": "A mid-sized e-commerce company wants to expand into international markets. Analyze the market opportunities, competitive landscape, and develop a comprehensive growth strategy including market entry tactics, pricing models, and operational requirements.",
            "category": "Strategy",
            "domain": "E-commerce",
            "difficulty": "Hard",
            "company": "TechMart",
            "tags": ["growth", "international", "strategy", "market-entry"]
        },
        {
            "title": "Customer Acquisition Cost Optimization",
            "description": "A SaaS startup is struggling with high customer acquisition costs. Their current CAC is $150 while LTV is $300. Identify the issues in their marketing funnel and propose solutions to optimize their marketing spend and improve conversion rates.",
            "category": "Marketing",
            "domain": "Technology",
            "difficulty": "Medium",
            "company": "CloudFlow",
            "tags": ["marketing", "SaaS", "optimization", "CAC", "conversion"]
        },
        {
            "title": "Supply Chain Efficiency Improvement",
            "description": "A manufacturing company is facing supply chain disruptions causing 15% delivery delays and 20% cost overruns. Develop a comprehensive plan to improve efficiency, reduce costs, and build resilience against future disruptions.",
            "category": "Operations",
            "domain": "Manufacturing",
            "difficulty": "Medium",
            "company": "IndustrialCorp",
            "tags": ["supply-chain", "operations", "efficiency", "cost-reduction"]
        },
        {
            "title": "Digital Transformation Strategy",
            "description": "A traditional retail bank wants to compete with fintech startups. Design a digital transformation roadmap that includes mobile banking, AI-powered customer service, and data analytics capabilities while maintaining regulatory compliance.",
            "category": "Strategy",
            "domain": "Financial Services",
            "difficulty": "Hard",
            "company": "SecureBank",
            "tags": ["digital-transformation", "fintech", "banking", "AI", "compliance"]
        },
        {
            "title": "Pricing Strategy for New Product Launch",
            "description": "A tech company is launching a revolutionary fitness wearable device. Analyze the competitive landscape and develop an optimal pricing strategy considering production costs, market positioning, and customer segments.",
            "category": "Strategy",
            "domain": "Technology",
            "difficulty": "Easy",
            "company": "FitTech",
            "tags": ["pricing", "product-launch", "wearable", "market-analysis"]
        }
    ]
    
    # API endpoint
    api_url = "http://localhost:8001/api/admin/problems"
    
    # Note: In a real scenario, you would get the Firebase ID token from the frontend
    # For testing purposes, this script assumes the admin is already authenticated
    print("Test problems prepared. These should be created through the admin interface.")
    print(f"Number of problems: {len(problems)}")
    
    for i, problem in enumerate(problems, 1):
        print(f"{i}. {problem['title']} ({problem['difficulty']}) - {problem['category']}")
    
    return problems

if __name__ == "__main__":
    problems = create_test_problems()
    print("\n✅ Test problems ready for creation through admin interface")
    print("📋 Use these problems when testing the admin problem creation functionality")