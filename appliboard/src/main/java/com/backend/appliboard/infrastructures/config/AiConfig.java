package com.backend.appliboard.infrastructures.config;

import com.backend.appliboard.shared.exceptions.AiUnavailableException;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    private static final String AI_NOT_CONFIGURED_MESSAGE =
            "AI features are not configured yet. Set an AI API key to enable them.";


    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }

    /**
     * @param chatClientProvider the optional {@link ChatClient} bean
     * @return the chat client
     * @throws AiUnavailableException if AI is not configured (no {@link ChatClient} bean)
     */
    public static ChatClient requireChatClient(ObjectProvider<ChatClient> chatClientProvider) {
        ChatClient chatClient = chatClientProvider.getIfAvailable();
        if (chatClient == null) {
            throw new AiUnavailableException(AI_NOT_CONFIGURED_MESSAGE);
        }

        return chatClient;
    }
}
