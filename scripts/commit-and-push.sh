#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 NPT Commit and Push Workflow${NC}"
echo "═══════════════════════════════════════"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    exit 0
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Current branch: ${CURRENT_BRANCH}${NC}"

# Show status
echo -e "\n${BLUE}📋 Current status:${NC}"
git status --short

# Stage all files
echo -e "\n${BLUE}📦 Staging all files...${NC}"
git add .

# Generate commit message based on changes
echo -e "\n${BLUE}🔍 Analyzing changes for commit message...${NC}"

# Get list of modified files
MODIFIED_FILES=$(git diff --cached --name-only)
NEW_FILES=$(git diff --cached --name-status | grep '^A' | wc -l | tr -d ' ')
MODIFIED_COUNT=$(git diff --cached --name-status | grep '^M' | wc -l | tr -d ' ')
DELETED_COUNT=$(git diff --cached --name-status | grep '^D' | wc -l | tr -d ' ')

# Analyze file types and areas
TYPESCRIPT_FILES=$(echo "$MODIFIED_FILES" | grep -E '\.(ts|tsx)$' | wc -l | tr -d ' ')
TEST_FILES=$(echo "$MODIFIED_FILES" | grep -E '\.test\.(ts|tsx)$' | wc -l | tr -d ' ')
AUDIO_FILES=$(echo "$MODIFIED_FILES" | grep 'src/audio' | wc -l | tr -d ' ')
VISUAL_FILES=$(echo "$MODIFIED_FILES" | grep 'src/visual' | wc -l | tr -d ' ')
CORE_FILES=$(echo "$MODIFIED_FILES" | grep 'src/core' | wc -l | tr -d ' ')
DATA_FILES=$(echo "$MODIFIED_FILES" | grep 'src/data' | wc -l | tr -d ' ')
SPEC_FILES=$(echo "$MODIFIED_FILES" | grep '\.kiro/specs' | wc -l | tr -d ' ')
STEERING_FILES=$(echo "$MODIFIED_FILES" | grep '\.kiro/steering' | wc -l | tr -d ' ')
HOOK_FILES=$(echo "$MODIFIED_FILES" | grep '\.kiro/hooks' | wc -l | tr -d ' ')

# Generate descriptive commit message
COMMIT_MSG=""

# Determine primary change type
if [ "$TYPESCRIPT_FILES" -gt 10 ]; then
    if [ "$VISUAL_FILES" -gt "$AUDIO_FILES" ] && [ "$VISUAL_FILES" -gt "$CORE_FILES" ]; then
        COMMIT_MSG="fix(visual): resolve TypeScript errors across visual subsystem"
    elif [ "$AUDIO_FILES" -gt "$VISUAL_FILES" ] && [ "$AUDIO_FILES" -gt "$CORE_FILES" ]; then
        COMMIT_MSG="fix(audio): resolve TypeScript errors in audio engine"
    elif [ "$CORE_FILES" -gt 5 ]; then
        COMMIT_MSG="fix(core): resolve TypeScript errors in core subsystem"
    else
        COMMIT_MSG="fix: resolve TypeScript errors across multiple subsystems"
    fi
elif [ "$TEST_FILES" -gt 5 ]; then
    COMMIT_MSG="test: add property-based tests and fix test issues"
elif [ "$SPEC_FILES" -gt 0 ] && [ "$STEERING_FILES" -gt 0 ]; then
    COMMIT_MSG="docs: update specs and steering documentation"
elif [ "$SPEC_FILES" -gt 0 ]; then
    COMMIT_MSG="docs: update project specifications"
elif [ "$STEERING_FILES" -gt 0 ]; then
    COMMIT_MSG="docs: update steering guidelines"
elif [ "$HOOK_FILES" -gt 0 ]; then
    COMMIT_MSG="feat: add Kiro automation hooks"
elif [ "$VISUAL_FILES" -gt "$AUDIO_FILES" ] && [ "$VISUAL_FILES" -gt 5 ]; then
    COMMIT_MSG="feat(visual): enhance node editor and UI components"
elif [ "$AUDIO_FILES" -gt 5 ]; then
    COMMIT_MSG="feat(audio): improve audio engine and processing"
else
    COMMIT_MSG="chore: update project files and configurations"
fi

# Add details about scope
DETAILS=""
if [ "$MODIFIED_COUNT" -gt 0 ]; then
    DETAILS="${DETAILS}\n\n- Modified ${MODIFIED_COUNT} files"
fi
if [ "$NEW_FILES" -gt 0 ]; then
    DETAILS="${DETAILS}\n- Added ${NEW_FILES} new files"
fi
if [ "$DELETED_COUNT" -gt 0 ]; then
    DETAILS="${DETAILS}\n- Deleted ${DELETED_COUNT} files"
fi

# Add subsystem breakdown if significant
if [ "$TYPESCRIPT_FILES" -gt 10 ]; then
    DETAILS="${DETAILS}\n\nSubsystem changes:"
    if [ "$VISUAL_FILES" -gt 0 ]; then
        DETAILS="${DETAILS}\n- Visual: ${VISUAL_FILES} files"
    fi
    if [ "$AUDIO_FILES" -gt 0 ]; then
        DETAILS="${DETAILS}\n- Audio: ${AUDIO_FILES} files"
    fi
    if [ "$CORE_FILES" -gt 0 ]; then
        DETAILS="${DETAILS}\n- Core: ${CORE_FILES} files"
    fi
    if [ "$DATA_FILES" -gt 0 ]; then
        DETAILS="${DETAILS}\n- Data: ${DATA_FILES} files"
    fi
fi

# Full commit message
FULL_COMMIT_MSG="${COMMIT_MSG}${DETAILS}"

echo -e "\n${BLUE}📝 Commit message:${NC}"
echo -e "${GREEN}${COMMIT_MSG}${NC}"
if [ -n "$DETAILS" ]; then
    echo -e "${YELLOW}${DETAILS}${NC}"
fi

# Commit the changes
echo -e "\n${BLUE}💾 Committing changes...${NC}"
if git commit -m "$FULL_COMMIT_MSG"; then
    echo -e "${GREEN}✅ Commit successful${NC}"
else
    echo -e "${RED}❌ Commit failed${NC}"
    exit 1
fi

# Push to remote
echo -e "\n${BLUE}🚀 Pushing to remote...${NC}"
if git push origin "$CURRENT_BRANCH"; then
    echo -e "${GREEN}✅ Push successful${NC}"
    echo -e "\n${GREEN}🎉 All changes committed and pushed to GitHub!${NC}"
else
    echo -e "${RED}❌ Push failed${NC}"
    echo -e "${YELLOW}💡 You may need to pull changes first or check your remote configuration${NC}"
    exit 1
fi

# Show final status
echo -e "\n${BLUE}📊 Final status:${NC}"
git log --oneline -1
echo -e "\n${GREEN}✨ Workflow completed successfully!${NC}"