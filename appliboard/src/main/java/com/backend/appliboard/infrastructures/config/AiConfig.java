package com.backend.appliboard.infrastructures.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    private static final String AI_NOT_CONFIGURED_MESSAGE =
            "AI features are not configured yet. Set an AI API key to enable them.";

    // Disabled until an AI API key is configured. To enable: uncomment this bean, remove the
    // spring.ai.model.*=none lines from application.properties and set the API key.
    //
    // @Bean
    // public ChatClient chatClient(ChatClient.Builder builder) {
    //     return builder.build();
    // }

    /**
     * @param chatClientProvider the optional {@link ChatClient} bean
     * @return the chat client
     * @throws IllegalStateException if AI is not configured (no {@link ChatClient} bean)
     */
    public static ChatClient requireChatClient(ObjectProvider<ChatClient> chatClientProvider) {
        ChatClient chatClient = chatClientProvider.getIfAvailable();
        if (chatClient == null) {
            throw new IllegalStateException(AI_NOT_CONFIGURED_MESSAGE);
        }

        return chatClient;
    }
}
